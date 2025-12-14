<?php

namespace Database\Seeders;

use App\Models\CarListing;
use App\Models\Conversation;
use App\Models\PartRequest;
use App\Models\User;
use Illuminate\Database\Seeder;

class ConversationSeeder extends Seeder
{
    public function run(): void
    {
        $buyers = User::where('user_type', 'buyer')->get();
        $sellers = User::where('user_type', 'seller')->get();
        $partRequests = PartRequest::all();
        $carListings = CarListing::all();

        if ($buyers->isEmpty() || $sellers->isEmpty()) {
            return;
        }

        // Create conversations about part requests
        foreach ($partRequests->take(20) as $request) {
            $buyer = User::find($request->user_id);
            $seller = $sellers->random();

            // Don't create duplicate conversations
            $exists = Conversation::where(function ($q) use ($buyer, $seller) {
                $q->where('participant_one_id', $buyer->id)
                    ->where('participant_two_id', $seller->id);
            })->orWhere(function ($q) use ($buyer, $seller) {
                $q->where('participant_one_id', $seller->id)
                    ->where('participant_two_id', $buyer->id);
            })->where('context_type', 'part_request')
                ->where('context_id', $request->id)
                ->exists();

            if (!$exists) {
                Conversation::create([
                    'participant_one_id' => $buyer->id,
                    'participant_two_id' => $seller->id,
                    'context_type' => 'part_request',
                    'context_id' => $request->id,
                    'last_message_at' => fake()->dateTimeBetween($request->created_at, 'now'),
                ]);
            }
        }

        // Create conversations about car listings
        foreach ($carListings->take(10) as $listing) {
            $seller = User::find($listing->user_id);
            $buyer = $buyers->random();

            // Don't create duplicate conversations
            $exists = Conversation::where(function ($q) use ($buyer, $seller) {
                $q->where('participant_one_id', $buyer->id)
                    ->where('participant_two_id', $seller->id);
            })->orWhere(function ($q) use ($buyer, $seller) {
                $q->where('participant_one_id', $seller->id)
                    ->where('participant_two_id', $buyer->id);
            })->where('context_type', 'car_listing')
                ->where('context_id', $listing->id)
                ->exists();

            if (!$exists) {
                Conversation::create([
                    'participant_one_id' => $buyer->id,
                    'participant_two_id' => $seller->id,
                    'context_type' => 'car_listing',
                    'context_id' => $listing->id,
                    'last_message_at' => fake()->dateTimeBetween($listing->created_at, 'now'),
                ]);
            }
        }
    }
}
