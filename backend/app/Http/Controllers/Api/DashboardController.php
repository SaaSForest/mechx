<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CarListing;
use App\Models\Notification;
use App\Models\Offer;
use App\Models\PartRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function buyerStats(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $stats = [
            'requests' => PartRequest::where('user_id', $userId)->count(),
            'active_requests' => PartRequest::where('user_id', $userId)->where('status', 'active')->count(),
            'offers_received' => Offer::whereHas('partRequest', function ($q) use ($userId) {
                $q->where('user_id', $userId);
            })->count(),
            'pending_offers' => Offer::whereHas('partRequest', function ($q) use ($userId) {
                $q->where('user_id', $userId);
            })->where('status', 'pending')->count(),
            'completed' => PartRequest::where('user_id', $userId)->where('status', 'completed')->count(),
        ];

        $recentRequests = PartRequest::with(['photos', 'offers'])
            ->where('user_id', $userId)
            ->latest()
            ->limit(5)
            ->get();

        $featuredCars = CarListing::with(['photos', 'user'])
            ->where('status', 'active')
            ->where('is_featured', true)
            ->limit(5)
            ->get();

        $unreadNotifications = Notification::where('user_id', $userId)
            ->where('is_read', false)
            ->count();

        return response()->json([
            'stats' => $stats,
            'recent_requests' => $recentRequests,
            'featured_cars' => $featuredCars,
            'unread_notifications' => $unreadNotifications,
        ]);
    }

    public function sellerStats(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $stats = [
            'new_requests' => PartRequest::where('status', 'active')
                ->where('user_id', '!=', $userId)
                ->count(),
            'sent_offers' => Offer::where('seller_id', $userId)->count(),
            'pending_offers' => Offer::where('seller_id', $userId)->where('status', 'pending')->count(),
            'accepted_offers' => Offer::where('seller_id', $userId)->where('status', 'accepted')->count(),
            'rating' => $request->user()->rating,
            'total_sales' => $request->user()->sales_count,
        ];

        $revenue = Offer::where('seller_id', $userId)
            ->where('status', 'accepted')
            ->sum('price');

        $recentRequests = PartRequest::with(['photos', 'user'])
            ->where('status', 'active')
            ->where('user_id', '!=', $userId)
            ->latest()
            ->limit(5)
            ->get();

        $myOffers = Offer::with(['partRequest'])
            ->where('seller_id', $userId)
            ->latest()
            ->limit(5)
            ->get();

        $unreadNotifications = Notification::where('user_id', $userId)
            ->where('is_read', false)
            ->count();

        return response()->json([
            'stats' => $stats,
            'revenue' => $revenue,
            'recent_requests' => $recentRequests,
            'my_offers' => $myOffers,
            'unread_notifications' => $unreadNotifications,
        ]);
    }
}
