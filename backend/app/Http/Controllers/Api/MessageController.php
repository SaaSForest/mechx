<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Notification;
use App\Events\MessageSent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request, Conversation $conversation): JsonResponse
    {
        $userId = $request->user()->id;

        if ($conversation->participant_one_id !== $userId && $conversation->participant_two_id !== $userId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $messages = $conversation->messages()
            ->with('sender:id,full_name')
            ->orderBy('created_at', 'asc')
            ->paginate(50);

        return response()->json($messages);
    }

    public function store(Request $request, Conversation $conversation): JsonResponse
    {
        $userId = $request->user()->id;

        if ($conversation->participant_one_id !== $userId && $conversation->participant_two_id !== $userId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'content' => ['required', 'string', 'max:5000'],
        ]);

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $userId,
            'content' => $validated['content'],
        ]);

        $conversation->update(['last_message_at' => now()]);

        $message->load('sender:id,full_name');

        $recipientId = $conversation->participant_one_id === $userId
            ? $conversation->participant_two_id
            : $conversation->participant_one_id;

        Notification::create([
            'user_id' => $recipientId,
            'type' => 'message',
            'title' => 'New Message',
            'message' => "{$request->user()->full_name} sent you a message",
            'data' => ['conversation_id' => $conversation->id],
        ]);

        broadcast(new MessageSent($message, $conversation))->toOthers();

        return response()->json([
            'message' => 'Message sent',
            'data' => $message,
        ], 201);
    }

    public function markAsRead(Request $request, Conversation $conversation): JsonResponse
    {
        $userId = $request->user()->id;

        if ($conversation->participant_one_id !== $userId && $conversation->participant_two_id !== $userId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $conversation->messages()
            ->where('sender_id', '!=', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['message' => 'Messages marked as read']);
    }
}
