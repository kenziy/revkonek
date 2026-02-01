<?php

use App\Http\Controllers\Api\V1\Shops\ShopController;
use App\Http\Controllers\Api\V1\Shops\ShopVerificationController;
use App\Http\Controllers\Api\V1\Shops\ShopReviewController;
use App\Http\Controllers\Api\V1\Shops\PartsRequestController;
use Illuminate\Support\Facades\Route;

// Shops discovery
Route::get('/', [ShopController::class, 'index']);
Route::get('/nearby', [ShopController::class, 'nearby']);
Route::get('/{shop}', [ShopController::class, 'show']);

// Shop management (for shop owners)
Route::prefix('my')->group(function () {
    Route::get('/', [ShopController::class, 'myShop']);
    Route::post('/', [ShopController::class, 'store']);
    Route::put('/', [ShopController::class, 'update']);
    Route::delete('/', [ShopController::class, 'destroy']);
});

// Shop verification
Route::prefix('verification')->group(function () {
    Route::get('/status', [ShopVerificationController::class, 'status']);
    Route::post('/submit', [ShopVerificationController::class, 'submit']);
    Route::post('/documents', [ShopVerificationController::class, 'uploadDocuments']);
});

// Reviews
Route::prefix('{shop}/reviews')->group(function () {
    Route::get('/', [ShopReviewController::class, 'index']);
    Route::post('/', [ShopReviewController::class, 'store']);
    Route::put('/{review}', [ShopReviewController::class, 'update']);
    Route::delete('/{review}', [ShopReviewController::class, 'destroy']);
    Route::post('/{review}/respond', [ShopReviewController::class, 'respond']);
});

// Parts Requests
Route::prefix('parts-requests')->group(function () {
    Route::get('/', [PartsRequestController::class, 'index']);
    Route::post('/', [PartsRequestController::class, 'store']);
    Route::get('/{request}', [PartsRequestController::class, 'show']);
    Route::delete('/{request}', [PartsRequestController::class, 'destroy']);
    Route::get('/{request}/quotes', [PartsRequestController::class, 'quotes']);
    Route::post('/{request}/quotes', [PartsRequestController::class, 'submitQuote']);
});
