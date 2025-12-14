<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\PartRequest;
use App\Models\CarListing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $conversations = Conversation::with(['participantOne', 'participantTwo', 'latestMessage'])
            ->where(function ($q) use ($userId) {
                $q->where('participant_one_id', $userId)
                  ->orWhere('participant_two_id', $userId);
            })
            ->orderByDesc('last_message_at')
            ->paginate(20);

        $conversations->getCollection()->transform(function ($conversation) use ($userId) {
            $otherParticipant = $conversation->getOtherParticipant($userId);
            $context = $conversation->context();

            return [
                'id' => $conversation->id,
                'other_user' => [
                    'id' => $otherParticipant->id,
                    'full_name' => $otherParticipant->full_name,
                    'profile_photo_url' => $otherParticipant->profile_photo_url,
                    'is_verified' => $otherParticipant->is_verified,
                ],
                'context_type' => $conversation->context_type,
                'context' => $context ? [
                    'id' => $context->id,
                    'name' => $conversation->context_type === 'part_request'
                        ? $context->part_name
                        : "{$context->make} {$context->model}",
                ] : null,
                'last_message' => $conversation->latestMessage,
                'unread_count' => $conversation->unreadCountFor($userId),
                'last_message_at' => $conversation->last_message_at,
            ];
        });

        return response()->json($conversations);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'recipient_id' => ['required', 'exists:users,id'],
            'context_type' => ['required', 'in:part_request,car_listing'],
            'context_id' => ['required', 'integer'],
        ]);

        $userId = $request->user()->id;
        $recipientId = $validated['recipient_id'];

        if ($userId === $recipientId) {
            return response()->json(['message' => 'Cannot start conversation with yourself'], 400);
        }

        if ($validated['context_type'] === 'part_request') {
            $context = PartRequest::find($validated['context_id']);
        } else {
            $context = CarListing::find($validated['context_id']);
        }

        if (!$context) {
            return response()->json(['message' => 'Context not found'], 404);
        }

        $participantOneId = min($userId, $recipientId);
        $participantTwoId = max($userId, $recipientId);

        $conversation = Conversation::firstOrCreate(
            [
                'participant_one_id' => $participantOneId,
                'participant_two_id' => $participantTwoId,
                'context_type' => $validated['context_type'],
                'context_id' => $validated['context_id'],
            ],
            [
                'last_message_at' => now(),
            ]
        );

        return response()->json([
            'message' => 'Conversation created',
            'conversation' => $conversation->load(['participantOne', 'participantTwo']),
        ], 201);
    }

    public function show(Request $request, Conversation $conversation): JsonResponse
    {
        $userId = $request->user()->id;

        if ($conversation->participant_one_id !== $userId && $conversation->participant_two_id !== $userId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $otherParticipant = $conversation->getOtherParticipant($userId);
        $context = $conversation->context();

        return response()->json([
            'id' => $conversation->id,
            'other_user' => [
                'id' => $otherParticipant->id,
                'full_name' => $otherParticipant->full_name,
                'profile_photo_url' => $otherParticipant->profile_photo_url,
                'is_verified' => $otherParticipant->is_verified,
            ],
            'context_type' => $conversation->context_type,
            'context' => $context ? [
                'id' => $context->id,
                'name' => $conversation->context_type === 'part_request'
                    ? $context->part_name
                    : "{$context->make} {$context->model}",
                'price' => $conversation->context_type === 'car_listing' ? $context->price : null,
            ] : null,
            'created_at' => $conversation->created_at,
        ]);
    }
}
