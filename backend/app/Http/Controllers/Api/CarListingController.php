<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CarListing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CarListingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = CarListing::with(['user', 'media'])->where('status', 'active');

        if ($request->has('featured') && $request->featured) {
            $query->where('is_featured', true);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('make', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%");
            });
        }

        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->has('fuel_type')) {
            $query->where('fuel_type', $request->fuel_type);
        }

        if ($request->has('transmission')) {
            $query->where('transmission', $request->transmission);
        }

        $cars = $query->latest()->paginate(15);

        $cars->getCollection()->transform(function ($car) {
            $car->photos = $car->photos;
            $car->primary_photo = $car->primary_photo;
            return $car;
        });

        return response()->json($cars);
    }

    public function myListings(Request $request): JsonResponse
    {
        $query = CarListing::with(['media'])
            ->where('user_id', $request->user()->id);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $cars = $query->latest()->paginate(15);

        $cars->getCollection()->transform(function ($car) {
            $car->photos = $car->photos;
            return $car;
        });

        return response()->json($cars);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'make' => ['required', 'string', 'max:100'],
            'model' => ['required', 'string', 'max:100'],
            'year' => ['required', 'integer', 'min:1900', 'max:' . (date('Y') + 1)],
            'mileage' => ['required', 'string', 'max:50'],
            'price' => ['required', 'numeric', 'min:0'],
            'fuel_type' => ['required', 'in:petrol,diesel,electric,hybrid'],
            'transmission' => ['required', 'in:automatic,manual'],
            'location' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $car = CarListing::create([
            'user_id' => $request->user()->id,
            ...$validated,
        ]);

        return response()->json([
            'message' => 'Car listing created successfully',
            'car_listing' => array_merge($car->toArray(), ['photos' => []]),
        ], 201);
    }

    public function show(CarListing $carListing): JsonResponse
    {
        $carListing->load(['user', 'media']);
        $carListing->photos = $carListing->photos;
        $carListing->primary_photo = $carListing->primary_photo;

        return response()->json($carListing);
    }

    public function update(Request $request, CarListing $carListing): JsonResponse
    {
        if ($carListing->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'make' => ['sometimes', 'string', 'max:100'],
            'model' => ['sometimes', 'string', 'max:100'],
            'year' => ['sometimes', 'integer', 'min:1900', 'max:' . (date('Y') + 1)],
            'mileage' => ['sometimes', 'string', 'max:50'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'fuel_type' => ['sometimes', 'in:petrol,diesel,electric,hybrid'],
            'transmission' => ['sometimes', 'in:automatic,manual'],
            'location' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['sometimes', 'in:active,sold,expired'],
        ]);

        $carListing->update($validated);
        $carListing->refresh();
        $carListing->photos = $carListing->photos;

        return response()->json([
            'message' => 'Car listing updated successfully',
            'car_listing' => $carListing,
        ]);
    }

    public function destroy(Request $request, CarListing $carListing): JsonResponse
    {
        if ($carListing->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $carListing->clearMediaCollection('photos');
        $carListing->delete();

        return response()->json(['message' => 'Car listing deleted successfully']);
    }

    public function uploadPhoto(Request $request, CarListing $carListing): JsonResponse
    {
        if ($carListing->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'photo' => ['required', 'image', 'max:5120'],
        ]);

        $media = $carListing->addMediaFromRequest('photo')
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

    public function deletePhoto(Request $request, CarListing $carListing, int $photoId): JsonResponse
    {
        if ($carListing->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $media = $carListing->getMedia('photos')->where('id', $photoId)->first();

        if (!$media) {
            return response()->json(['message' => 'Photo not found'], 404);
        }

        $media->delete();

        return response()->json(['message' => 'Photo deleted successfully']);
    }

    public function toggleFeatured(Request $request, CarListing $carListing): JsonResponse
    {
        if ($carListing->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $carListing->update(['is_featured' => !$carListing->is_featured]);

        return response()->json([
            'message' => $carListing->is_featured ? 'Listing featured' : 'Listing unfeatured',
            'is_featured' => $carListing->is_featured,
        ]);
    }
}
