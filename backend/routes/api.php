<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CarListingController;
use App\Http\Controllers\Api\ConversationController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\OfferController;
use App\Http\Controllers\Api\PartRequestController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\SavedItemController;
use App\Http\Controllers\Api\SearchController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

// Public car listings
Route::get('/cars', [CarListingController::class, 'index']);
Route::get('/cars/{carListing}', [CarListingController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth & Profile
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user', [AuthController::class, 'updateProfile']);
    Route::post('/user/photo', [AuthController::class, 'uploadPhoto']);
    Route::post('/user/push-token', [AuthController::class, 'updatePushToken']);
    Route::post('/auth/change-password', [AuthController::class, 'changePassword']);
    Route::delete('/auth/account', [AuthController::class, 'deleteAccount']);

    // Dashboard
    Route::get('/dashboard/buyer', [DashboardController::class, 'buyerStats']);
    Route::get('/dashboard/seller', [DashboardController::class, 'sellerStats']);

    // Part Requests (Buyer)
    Route::get('/part-requests', [PartRequestController::class, 'index']);
    Route::post('/part-requests', [PartRequestController::class, 'store']);
    Route::get('/part-requests/{partRequest}', [PartRequestController::class, 'show']);
    Route::put('/part-requests/{partRequest}', [PartRequestController::class, 'update']);
    Route::delete('/part-requests/{partRequest}', [PartRequestController::class, 'destroy']);
    Route::post('/part-requests/{partRequest}/photos', [PartRequestController::class, 'uploadPhoto']);
    Route::delete('/part-requests/{partRequest}/photos/{photoId}', [PartRequestController::class, 'deletePhoto']);
    Route::post('/part-requests/{partRequest}/complete', [PartRequestController::class, 'markComplete']);

    // Browse Requests (Seller)
    Route::get('/browse-requests', [PartRequestController::class, 'browse']);

    // Offers
    Route::get('/offers', [OfferController::class, 'index']);
    Route::get('/my-offers', [OfferController::class, 'myOffers']);
    Route::post('/offers', [OfferController::class, 'store']);
    Route::get('/offers/{offer}', [OfferController::class, 'show']);
    Route::put('/offers/{offer}', [OfferController::class, 'update']);
    Route::delete('/offers/{offer}', [OfferController::class, 'destroy']);
    Route::post('/offers/{offer}/accept', [OfferController::class, 'accept']);
    Route::post('/offers/{offer}/reject', [OfferController::class, 'reject']);
    Route::post('/offers/{offer}/photos', [OfferController::class, 'uploadPhoto']);
    Route::delete('/offers/{offer}/photos/{photoId}', [OfferController::class, 'deletePhoto']);

    // Car Listings (authenticated)
    Route::get('/my-cars', [CarListingController::class, 'myListings']);
    Route::post('/cars', [CarListingController::class, 'store']);
    Route::put('/cars/{carListing}', [CarListingController::class, 'update']);
    Route::delete('/cars/{carListing}', [CarListingController::class, 'destroy']);
    Route::post('/cars/{carListing}/photos', [CarListingController::class, 'uploadPhoto']);
    Route::delete('/cars/{carListing}/photos/{photoId}', [CarListingController::class, 'deletePhoto']);
    Route::post('/cars/{carListing}/feature', [CarListingController::class, 'toggleFeatured']);

    // Conversations & Messages
    Route::get('/conversations', [ConversationController::class, 'index']);
    Route::post('/conversations', [ConversationController::class, 'store']);
    Route::get('/conversations/{conversation}', [ConversationController::class, 'show']);
    Route::get('/conversations/{conversation}/messages', [MessageController::class, 'index']);
    Route::post('/conversations/{conversation}/messages', [MessageController::class, 'store']);
    Route::post('/conversations/{conversation}/read', [MessageController::class, 'markAsRead']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy']);

    // Search
    Route::get('/search', [SearchController::class, 'search']);
    Route::get('/search/cars', [SearchController::class, 'searchCars']);
    Route::get('/search/parts', [SearchController::class, 'searchParts']);
    Route::get('/search/sellers', [SearchController::class, 'searchSellers']);

    // Reviews
    Route::get('/users/{userId}/reviews', [ReviewController::class, 'index']);
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::get('/offers/{offer}/can-review', [ReviewController::class, 'canReview']);

    // Saved Items
    Route::get('/saved-items', [SavedItemController::class, 'index']);
    Route::post('/saved-items', [SavedItemController::class, 'store']);
    Route::delete('/saved-items/{type}/{id}', [SavedItemController::class, 'destroy']);
    Route::get('/saved-items/check/{type}/{id}', [SavedItemController::class, 'check']);
});
