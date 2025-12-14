<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CarListing;
use App\Models\PartRequest;
use App\Models\SavedItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SavedItemController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $savedItems = SavedItem::where('user_id', $userId)
            ->with('saveable')
            ->orderBy('created_at', 'desc')
            ->get();

        // Separate items by type
        $savedCars = $savedItems
            ->where('saveable_type', CarListing::class)
            ->map(function ($item) {
                $car = $item->saveable;
                if (!$car) return null;

                return [
                    'id' => $car->id,
                    'title' => $car->title,
                    'make' => $car->make,
                    'model' => $car->model,
                    'year' => $car->year,
                    'price' => $car->price,
                    'mileage' => $car->mileage,
                    'location' => $car->location,
                    'photo_url' => $car->getFirstMediaUrl('photos'),
                    'saved_at' => $item->created_at,
                ];
            })
            ->filter()
            ->values();

        $savedParts = $savedItems
            ->where('saveable_type', PartRequest::class)
            ->map(function ($item) {
                $part = $item->saveable;
                if (!$part) return null;

                return [
                    'id' => $part->id,
                    'title' => $part->title,
                    'part_name' => $part->part_name,
                    'car_make' => $part->car_make,
                    'car_model' => $part->car_model,
                    'car_year' => $part->car_year,
                    'status' => $part->status,
                    'offers_count' => $part->offers()->count(),
                    'photo_url' => $part->getFirstMediaUrl('photos'),
                    'saved_at' => $item->created_at,
                ];
            })
            ->filter()
            ->values();

        return response()->json([
            'cars' => $savedCars,
            'parts' => $savedParts,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'in:car,part'],
            'id' => ['required', 'integer'],
        ]);

        $userId = $request->user()->id;

        // Determine the model class based on type
        $modelClass = $validated['type'] === 'car' ? CarListing::class : PartRequest::class;
        $model = $modelClass::find($validated['id']);

        if (!$model) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        // Check if already saved
        $existing = SavedItem::where('user_id', $userId)
            ->where('saveable_type', $modelClass)
            ->where('saveable_id', $validated['id'])
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Item already saved'], 409);
        }

        SavedItem::create([
            'user_id' => $userId,
            'saveable_type' => $modelClass,
            'saveable_id' => $validated['id'],
        ]);

        return response()->json(['message' => 'Item saved successfully'], 201);
    }

    public function destroy(Request $request, string $type, int $id): JsonResponse
    {
        $userId = $request->user()->id;

        $modelClass = $type === 'car' ? CarListing::class : PartRequest::class;

        $savedItem = SavedItem::where('user_id', $userId)
            ->where('saveable_type', $modelClass)
            ->where('saveable_id', $id)
            ->first();

        if (!$savedItem) {
            return response()->json(['message' => 'Saved item not found'], 404);
        }

        $savedItem->delete();

        return response()->json(['message' => 'Item removed from saved']);
    }

    public function check(Request $request, string $type, int $id): JsonResponse
    {
        $userId = $request->user()->id;

        $modelClass = $type === 'car' ? CarListing::class : PartRequest::class;

        $isSaved = SavedItem::where('user_id', $userId)
            ->where('saveable_type', $modelClass)
            ->where('saveable_id', $id)
            ->exists();

        return response()->json(['is_saved' => $isSaved]);
    }
}
