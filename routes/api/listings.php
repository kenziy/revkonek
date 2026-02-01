<?php

use App\Http\Controllers\Api\V1\Listings\ListingController;
use App\Http\Controllers\Api\V1\Listings\ListingCategoryController;
use App\Http\Controllers\Api\V1\Listings\ListingInquiryController;
use Illuminate\Support\Facades\Route;

// Listings discovery
Route::get('/', [ListingController::class, 'index']);
Route::get('/featured', [ListingController::class, 'featured']);
Route::get('/categories', [ListingCategoryController::class, 'index']);
Route::get('/{listing}', [ListingController::class, 'show']);

// Listing management (for shop owners)
Route::middleware('shop.owner')->group(function () {
    Route::post('/', [ListingController::class, 'store']);
    Route::put('/{listing}', [ListingController::class, 'update']);
    Route::delete('/{listing}', [ListingController::class, 'destroy']);
    Route::post('/{listing}/images', [ListingController::class, 'uploadImages']);
    Route::delete('/{listing}/images/{image}', [ListingController::class, 'deleteImage']);
    Route::post('/{listing}/feature', [ListingController::class, 'feature']);
});

// Inquiries
Route::prefix('{listing}/inquiries')->group(function () {
    Route::post('/', [ListingInquiryController::class, 'store']);
    Route::get('/', [ListingInquiryController::class, 'index'])
        ->middleware('shop.owner');
    Route::post('/{inquiry}/respond', [ListingInquiryController::class, 'respond'])
        ->middleware('shop.owner');
});

// My listings (as buyer)
Route::get('/my/inquiries', [ListingInquiryController::class, 'myInquiries']);
Route::get('/my/favorites', [ListingController::class, 'favorites']);
Route::post('/{listing}/favorite', [ListingController::class, 'addFavorite']);
Route::delete('/{listing}/favorite', [ListingController::class, 'removeFavorite']);
