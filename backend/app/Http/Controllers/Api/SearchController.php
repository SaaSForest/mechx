<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CarListing;
use App\Models\PartRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search(Request $request): JsonResponse
    {
        $query = $request->get('q', '');
        $type = $request->get('type');

        $results = [];

        if (!$type || $type === 'cars') {
            $results['cars'] = CarListing::with(['media', 'user'])
                ->where('status', 'active')
                ->where(function ($q) use ($query) {
                    $q->where('make', 'like', "%{$query}%")
                      ->orWhere('model', 'like', "%{$query}%")
                      ->orWhere('location', 'like', "%{$query}%");
                })
                ->limit(10)
                ->get();
        }

        if (!$type || $type === 'parts') {
            $results['parts'] = PartRequest::with(['media', 'user'])
                ->where('status', 'active')
                ->where(function ($q) use ($query) {
                    $q->where('part_name', 'like', "%{$query}%")
                      ->orWhere('car_make', 'like', "%{$query}%")
                      ->orWhere('car_model', 'like', "%{$query}%");
                })
                ->limit(10)
                ->get();
        }

        if (!$type || $type === 'sellers') {
            $results['sellers'] = User::where('user_type', 'seller')
                ->where(function ($q) use ($query) {
                    $q->where('full_name', 'like', "%{$query}%")
                      ->orWhere('business_name', 'like', "%{$query}%")
                      ->orWhere('specialty', 'like', "%{$query}%");
                })
                ->limit(10)
                ->get(['id', 'full_name', 'business_name', 'specialty', 'rating', 'sales_count', 'is_verified'])
                ->map(function ($seller) {
                    $seller->profile_photo_url = $seller->profile_photo_url;
                    return $seller;
                });
        }

        return response()->json($results);
    }

    public function searchCars(Request $request): JsonResponse
    {
        $query = $request->get('q', '');

        $cars = CarListing::with(['media', 'user'])
            ->where('status', 'active')
            ->where(function ($q) use ($query) {
                $q->where('make', 'like', "%{$query}%")
                  ->orWhere('model', 'like', "%{$query}%")
                  ->orWhere('location', 'like', "%{$query}%");
            })
            ->paginate(15);

        // Transform to include photos using model accessor
        $cars->getCollection()->transform(function ($car) {
            $car->photos = $car->photos;
            return $car;
        });

        return response()->json($cars);
    }

    public function searchParts(Request $request): JsonResponse
    {
        $query = $request->get('q', '');

        $parts = PartRequest::with(['media', 'user'])
            ->where('status', 'active')
            ->where(function ($q) use ($query) {
                $q->where('part_name', 'like', "%{$query}%")
                  ->orWhere('car_make', 'like', "%{$query}%")
                  ->orWhere('car_model', 'like', "%{$query}%");
            })
            ->paginate(15);

        // Transform to include photos using model accessor
        $parts->getCollection()->transform(function ($part) {
            $part->photos = $part->photos;
            return $part;
        });

        return response()->json($parts);
    }

    public function searchSellers(Request $request): JsonResponse
    {
        $query = $request->get('q', '');

        $sellers = User::where('user_type', 'seller')
            ->where(function ($q) use ($query) {
                $q->where('full_name', 'like', "%{$query}%")
                  ->orWhere('business_name', 'like', "%{$query}%")
                  ->orWhere('specialty', 'like', "%{$query}%");
            })
            ->paginate(15, ['id', 'full_name', 'business_name', 'specialty', 'rating', 'sales_count', 'is_verified']);

        // Add profile photo URL
        $sellers->getCollection()->transform(function ($seller) {
            $seller->profile_photo_url = $seller->profile_photo_url;
            return $seller;
        });

        return response()->json($sellers);
    }
}
