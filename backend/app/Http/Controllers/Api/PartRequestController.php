<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\PartRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PartRequestController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = PartRequest::with(['offers.seller', 'user', 'media'])
            ->where('user_id', $request->user()->id);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $requests = $query->latest()->paginate(15);

        $requests->getCollection()->transform(function ($req) {
            $req->photos = $req->photos;
            return $req;
        });

        return response()->json($requests);
    }

    public function browse(Request $request): JsonResponse
    {
        $query = PartRequest::with(['user', 'media'])
            ->where('status', 'active')
            ->where('user_id', '!=', $request->user()->id);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('part_name', 'like', "%{$search}%")
                  ->orWhere('car_make', 'like', "%{$search}%")
                  ->orWhere('car_model', 'like', "%{$search}%");
            });
        }

        $requests = $query->latest()->paginate(15);

        $requests->getCollection()->transform(function ($req) {
            $req->photos = $req->photos;
            return $req;
        });

        return response()->json($requests);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'car_make' => ['required', 'string', 'max:100'],
            'car_model' => ['required', 'string', 'max:100'],
            'car_year' => ['required', 'integer', 'min:1900', 'max:' . (date('Y') + 1)],
            'engine' => ['nullable', 'string', 'max:100'],
            'part_name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'condition_preference' => ['required', 'in:new,used,any'],
            'offer_deadline' => ['nullable', 'date', 'after:now'],
            'budget_min' => ['nullable', 'numeric', 'min:0'],
            'budget_max' => ['nullable', 'numeric', 'min:0', 'gte:budget_min'],
            'location' => ['nullable', 'string', 'max:255'],
            'urgency' => ['nullable', 'in:flexible,standard,urgent'],
        ]);

        $partRequest = PartRequest::create([
            'user_id' => $request->user()->id,
            ...$validated,
        ]);

        return response()->json([
            'message' => 'Part request created successfully',
            'part_request' => array_merge($partRequest->toArray(), ['photos' => []]),
        ], 201);
    }

    public function show(PartRequest $partRequest): JsonResponse
    {
        $partRequest->load(['offers.seller', 'offers.media', 'user', 'media']);
        $partRequest->photos = $partRequest->photos;

        // Add photos to offers
        $partRequest->offers->transform(function ($offer) {
            $offer->photos = $offer->photos;
            return $offer;
        });

        return response()->json($partRequest);
    }

    public function update(Request $request, PartRequest $partRequest): JsonResponse
    {
        if ($partRequest->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($partRequest->status !== 'active') {
            return response()->json(['message' => 'Cannot update non-active request'], 400);
        }

        $validated = $request->validate([
            'car_make' => ['sometimes', 'string', 'max:100'],
            'car_model' => ['sometimes', 'string', 'max:100'],
            'car_year' => ['sometimes', 'integer', 'min:1900', 'max:' . (date('Y') + 1)],
            'engine' => ['nullable', 'string', 'max:100'],
            'part_name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'condition_preference' => ['sometimes', 'in:new,used,any'],
            'budget_min' => ['nullable', 'numeric', 'min:0'],
            'budget_max' => ['nullable', 'numeric', 'min:0', 'gte:budget_min'],
            'location' => ['nullable', 'string', 'max:255'],
            'urgency' => ['sometimes', 'in:flexible,standard,urgent'],
            'status' => ['sometimes', 'in:active,cancelled'],
        ]);

        $partRequest->update($validated);
        $partRequest->refresh();
        $partRequest->photos = $partRequest->photos;

        return response()->json([
            'message' => 'Part request updated successfully',
            'part_request' => $partRequest,
        ]);
    }

    public function destroy(Request $request, PartRequest $partRequest): JsonResponse
    {
        if ($partRequest->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($partRequest->offers()->where('status', 'accepted')->exists()) {
            return response()->json(['message' => 'Cannot delete request with accepted offer'], 400);
        }

        $partRequest->clearMediaCollection('photos');
        $partRequest->delete();

        return response()->json(['message' => 'Part request deleted successfully']);
    }

    public function uploadPhoto(Request $request, PartRequest $partRequest): JsonResponse
    {
        if ($partRequest->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'photo' => ['required', 'image', 'max:5120'],
        ]);

        $media = $partRequest->addMediaFromRequest('photo')
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

    public function deletePhoto(Request $request, PartRequest $partRequest, int $photoId): JsonResponse
    {
        if ($partRequest->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $media = $partRequest->getMedia('photos')->where('id', $photoId)->first();

        if (!$media) {
            return response()->json(['message' => 'Photo not found'], 404);
        }

        $media->delete();

        return response()->json(['message' => 'Photo deleted successfully']);
    }

    public function markComplete(Request $request, PartRequest $partRequest): JsonResponse
    {
        if ($partRequest->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($partRequest->status !== 'pending') {
            return response()->json(['message' => 'Only pending requests can be marked as complete'], 400);
        }

        $acceptedOffer = $partRequest->offers()->where('status', 'accepted')->first();

        if (!$acceptedOffer) {
            return response()->json(['message' => 'No accepted offer found for this request'], 400);
        }

        $partRequest->update(['status' => 'completed']);

        // Notify the seller
        Notification::create([
            'user_id' => $acceptedOffer->seller_id,
            'type' => 'order',
            'title' => 'Transaction Completed',
            'message' => "{$request->user()->full_name} marked the transaction for {$partRequest->part_name} as complete",
            'data' => ['part_request_id' => $partRequest->id, 'offer_id' => $acceptedOffer->id],
        ]);

        return response()->json([
            'message' => 'Request marked as complete',
            'part_request' => $partRequest->fresh(),
        ]);
    }
}
