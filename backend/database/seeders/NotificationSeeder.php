<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\Offer;
use App\Models\PartRequest;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $partRequests = PartRequest::all();
        $offers = Offer::all();

        foreach ($users as $user) {
            $notificationCount = fake()->numberBetween(2, 6);

            for ($i = 0; $i < $notificationCount; $i++) {
                $notification = $this->generateNotification($user, $partRequests, $offers);
                if ($notification) {
                    Notification::create($notification);
                }
            }
        }
    }

    protected function generateNotification(User $user, $partRequests, $offers): ?array
    {
        // Valid types from migration: offer, message, order, system
        $types = ['offer', 'message', 'order', 'system'];
        $type = fake()->randomElement($types);
        $isRead = fake()->boolean(40);
        $createdAt = fake()->dateTimeBetween('-14 days', 'now');

        switch ($type) {
            case 'offer':
                if ($user->user_type === 'buyer') {
                    $request = $partRequests->where('user_id', $user->id)->first();
                    if (!$request) {
                        return null;
                    }
                    return [
                        'user_id' => $user->id,
                        'type' => 'offer',
                        'title' => 'New Offer Received',
                        'message' => "You received a new offer for your {$request->part_name} request.",
                        'data' => ['part_request_id' => $request->id],
                        'is_read' => $isRead,
                        'created_at' => $createdAt,
                    ];
                } else {
                    // Seller notification about their offer
                    $offer = $offers->where('seller_id', $user->id)->first();
                    if (!$offer) {
                        return null;
                    }
                    $status = fake()->randomElement(['accepted', 'rejected']);
                    return [
                        'user_id' => $user->id,
                        'type' => 'offer',
                        'title' => $status === 'accepted' ? 'Offer Accepted!' : 'Offer Not Accepted',
                        'message' => $status === 'accepted'
                            ? 'Great news! Your offer has been accepted by the buyer.'
                            : 'Unfortunately, your offer was not accepted this time.',
                        'data' => ['offer_id' => $offer->id],
                        'is_read' => $isRead,
                        'created_at' => $createdAt,
                    ];
                }

            case 'message':
                return [
                    'user_id' => $user->id,
                    'type' => 'message',
                    'title' => 'New Message',
                    'message' => 'You have received a new message.',
                    'data' => [],
                    'is_read' => $isRead,
                    'created_at' => $createdAt,
                ];

            case 'order':
                if ($user->user_type === 'buyer') {
                    return [
                        'user_id' => $user->id,
                        'type' => 'order',
                        'title' => 'Order Update',
                        'message' => 'Your order has been shipped and is on its way.',
                        'data' => [],
                        'is_read' => $isRead,
                        'created_at' => $createdAt,
                    ];
                } else {
                    return [
                        'user_id' => $user->id,
                        'type' => 'order',
                        'title' => 'New Order Received',
                        'message' => 'You have received a new order. Please prepare for shipment.',
                        'data' => [],
                        'is_read' => $isRead,
                        'created_at' => $createdAt,
                    ];
                }

            case 'system':
                $systemMessages = [
                    ['title' => 'Welcome to mechX!', 'message' => 'Thanks for joining our marketplace. Start browsing parts now!'],
                    ['title' => 'Profile Complete', 'message' => 'Your profile has been verified. You can now access all features.'],
                    ['title' => 'New Feature Available', 'message' => 'Check out our new car listings section!'],
                    ['title' => 'Security Update', 'message' => 'We have enhanced our security measures for your protection.'],
                ];
                $systemMsg = fake()->randomElement($systemMessages);
                return [
                    'user_id' => $user->id,
                    'type' => 'system',
                    'title' => $systemMsg['title'],
                    'message' => $systemMsg['message'],
                    'data' => [],
                    'is_read' => $isRead,
                    'created_at' => $createdAt,
                ];

            default:
                return null;
        }
    }
}
