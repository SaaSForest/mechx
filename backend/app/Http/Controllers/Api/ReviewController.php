<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(int $userId): JsonResponse
    {
        $reviews = Review::with(['reviewer', 'offer.partRequest'])
            ->where('reviewed_user_id', $userId)
            ->latest()
            ->paginate(15);

        $reviews->getCollection()->transform(function ($review) {
            return [
                'id' => $review->id,
                'rating' => $review->rating,
                'comment' => $review->comment,
                'created_at' => $review->created_at,
                'reviewer' => [
                    'id' => $review->reviewer->id,
                    'full_name' => $review->reviewer->full_name,
                    'profile_photo' => $review->reviewer->profile_photo_url,
                ],
                'part_name' => $review->offer->partRequest->part_name ?? null,
            ];
        });

        return response()->json($reviews);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'offer_id' => ['required', 'exists:offers,id'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        $offer = Offer::with('partRequest')->findOrFail($validated['offer_id']);

        // Verify user owns the part request (buyer)
        if ($offer->partRequest->user_id !== $user->id) {
            return response()->json(['message' => 'You can only review offers on your own requests'], 403);
        }

        // Verify offer was accepted
        if ($offer->status !== 'accepted') {
            return response()->json(['message' => 'You can only review accepted offers'], 400);
        }

        // Verify request is completed
        if ($offer->partRequest->status !== 'completed') {
            return response()->json(['message' => 'You can only review after marking the request as complete'], 400);
        }

        // Check if already reviewed
        $existingReview = Review::where('offer_id', $offer->id)->first();
        if ($existingReview) {
            return response()->json(['message' => 'You have already reviewed this offer'], 400);
        }

        $review = Review::create([
            'reviewer_id' => $user->id,
            'reviewed_user_id' => $offer->seller_id,
            'offer_id' => $offer->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
        ]);

        // Recalculate seller's average rating
        $offer->seller->recalculateRating();

        $review->load('reviewer');

        return response()->json([
            'message' => 'Review submitted successfully',
            'review' => $review,
        ], 201);
    }

    public function canReview(Request $request, Offer $offer): JsonResponse
    {
        $user = $request->user();

        $offer->load('partRequest');

        // Check if user owns the request
        $ownsRequest = $offer->partRequest->user_id === $user->id;

        // Check if offer is accepted
        $isAccepted = $offer->status === 'accepted';

        // Check if request is completed
        $isCompleted = $offer->partRequest->status === 'completed';

        // Check if already reviewed
        $hasReviewed = Review::where('offer_id', $offer->id)->exists();

        $canReview = $ownsRequest && $isAccepted && $isCompleted && !$hasReviewed;

        return response()->json([
            'can_review' => $canReview,
            'has_reviewed' => $hasReviewed,
            'is_completed' => $isCompleted,
            'is_accepted' => $isAccepted,
            'owns_request' => $ownsRequest,
        ]);
    }
}
