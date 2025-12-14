<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use App\Models\PartRequest;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OfferController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = Offer::with(['partRequest', 'seller', 'media'])
            ->whereHas('partRequest', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $offers = $query->latest()->paginate(15);

        $offers->getCollection()->transform(function ($offer) {
            $offer->photos = $offer->photos;
            return $offer;
        });

        return response()->json($offers);
    }

    public function myOffers(Request $request): JsonResponse
    {
        $query = Offer::with(['partRequest.user', 'media'])
            ->where('seller_id', $request->user()->id);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $offers = $query->latest()->paginate(15);

        $offers->getCollection()->transform(function ($offer) {
            $offer->photos = $offer->photos;
            return $offer;
        });

        return response()->json($offers);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->user_type !== 'seller') {
            return response()->json(['message' => 'Only sellers can create offers'], 403);
        }

        $validated = $request->validate([
            'part_request_id' => ['required', 'exists:part_requests,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'part_condition' => ['required', 'in:new,used,refurbished'],
            'delivery_time' => ['required', 'string', 'max:100'],
            'notes' => ['nullable', 'string'],
        ]);

        $partRequest = PartRequest::findOrFail($validated['part_request_id']);

        if ($partRequest->user_id === $user->id) {
            return response()->json(['message' => 'Cannot submit offer on your own request'], 400);
        }

        if ($partRequest->status !== 'active') {
            return response()->json(['message' => 'Cannot submit offer on non-active request'], 400);
        }

        $existingOffer = Offer::where('part_request_id', $partRequest->id)
            ->where('seller_id', $user->id)
            ->first();

        if ($existingOffer) {
            return response()->json(['message' => 'You already submitted an offer for this request'], 400);
        }

        $offer = Offer::create([
            'part_request_id' => $partRequest->id,
            'seller_id' => $user->id,
            'price' => $validated['price'],
            'part_condition' => $validated['part_condition'],
            'delivery_time' => $validated['delivery_time'],
            'notes' => $validated['notes'] ?? null,
        ]);

        Notification::create([
            'user_id' => $partRequest->user_id,
            'type' => 'offer',
            'title' => 'New Offer Received',
            'message' => "{$user->full_name} sent you an offer for {$partRequest->part_name} - L{$offer->price}",
            'data' => ['offer_id' => $offer->id, 'part_request_id' => $partRequest->id],
        ]);

        $offer->load('seller');
        $offer->photos = $offer->photos;

        return response()->json([
            'message' => 'Offer submitted successfully',
            'offer' => $offer,
        ], 201);
    }

    public function show(Offer $offer): JsonResponse
    {
        $offer->load(['partRequest', 'seller', 'media']);
        $offer->photos = $offer->photos;

        return response()->json($offer);
    }

    public function update(Request $request, Offer $offer): JsonResponse
    {
        if ($offer->seller_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($offer->status !== 'pending') {
            return response()->json(['message' => 'Cannot update non-pending offer'], 400);
        }

        $validated = $request->validate([
            'price' => ['sometimes', 'numeric', 'min:0'],
            'part_condition' => ['sometimes', 'in:new,used,refurbished'],
            'delivery_time' => ['sometimes', 'string', 'max:100'],
            'notes' => ['nullable', 'string'],
        ]);

        $offer->update($validated);
        $offer->refresh();
        $offer->photos = $offer->photos;

        return response()->json([
            'message' => 'Offer updated successfully',
            'offer' => $offer,
        ]);
    }

    public function destroy(Request $request, Offer $offer): JsonResponse
    {
        if ($offer->seller_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($offer->status === 'accepted') {
            return response()->json(['message' => 'Cannot withdraw accepted offer'], 400);
        }

        $offer->clearMediaCollection('photos');
        $offer->update(['status' => 'withdrawn']);

        return response()->json(['message' => 'Offer withdrawn successfully']);
    }

    public function accept(Request $request, Offer $offer): JsonResponse
    {
        $partRequest = $offer->partRequest;

        if ($partRequest->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($offer->status !== 'pending') {
            return response()->json(['message' => 'Cannot accept non-pending offer'], 400);
        }

        $offer->update(['status' => 'accepted']);
        $partRequest->update(['status' => 'pending']);

        Offer::where('part_request_id', $partRequest->id)
            ->where('id', '!=', $offer->id)
            ->where('status', 'pending')
            ->update(['status' => 'rejected']);

        $seller = $offer->seller;
        $seller->increment('sales_count');

        Notification::create([
            'user_id' => $offer->seller_id,
            'type' => 'offer',
            'title' => 'Offer Accepted!',
            'message' => "Your offer for {$partRequest->part_name} was accepted",
            'data' => ['offer_id' => $offer->id, 'part_request_id' => $partRequest->id],
        ]);

        return response()->json([
            'message' => 'Offer accepted successfully',
            'offer' => $offer->fresh(),
        ]);
    }

    public function reject(Request $request, Offer $offer): JsonResponse
    {
        $partRequest = $offer->partRequest;

        if ($partRequest->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($offer->status !== 'pending') {
            return response()->json(['message' => 'Cannot reject non-pending offer'], 400);
        }

        $offer->update(['status' => 'rejected']);

        Notification::create([
            'user_id' => $offer->seller_id,
            'type' => 'offer',
            'title' => 'Offer Rejected',
            'message' => "Your offer for {$partRequest->part_name} was not accepted",
            'data' => ['offer_id' => $offer->id, 'part_request_id' => $partRequest->id],
        ]);

        return response()->json([
            'message' => 'Offer rejected',
            'offer' => $offer->fresh(),
        ]);
    }

    public function uploadPhoto(Request $request, Offer $offer): JsonResponse
    {
        if ($offer->seller_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'photo' => ['required', 'image', 'max:5120'],
        ]);

        $media = $offer->addMediaFromRequest('photo')
            ->toMediaCollection('photos');

        return response()->json([
            'message' => 'Photo uploaded successfully',
            'photo' => [
                'id' => $media->id,
                'url' => $media->getUrl(),
                'thumb' => $media->getUrl('thumb'),
            ],
        ], 201);
    }

    public function deletePhoto(Request $request, Offer $offer, int $photoId): JsonResponse
    {
        if ($offer->seller_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $media = $offer->getMedia('photos')->where('id', $photoId)->first();

        if (!$media) {
            return response()->json(['message' => 'Photo not found'], 404);
        }

        $media->delete();

        return response()->json(['message' => 'Photo deleted successfully']);
    }
}
