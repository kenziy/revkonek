<?php

use App\Http\Controllers\Api\V1\Bikes\BikeController;
use App\Http\Controllers\Api\V1\Bikes\BikePhotoController;
use Illuminate\Support\Facades\Route;

// Garage management
Route::get('/', [BikeController::class, 'index']);
Route::post('/', [BikeController::class, 'store']);
Route::get('/{bike}', [BikeController::class, 'show']);
Route::put('/{bike}', [BikeController::class, 'update']);
Route::delete('/{bike}', [BikeController::class, 'destroy']);
Route::post('/{bike}/set-active', [BikeController::class, 'setActive']);

// Bike photos
Route::prefix('{bike}/photos')->group(function () {
    Route::get('/', [BikePhotoController::class, 'index']);
    Route::post('/', [BikePhotoController::class, 'store']);
    Route::delete('/{photo}', [BikePhotoController::class, 'destroy']);
    Route::post('/{photo}/set-primary', [BikePhotoController::class, 'setPrimary']);
});

// View other users' bikes
Route::get('/user/{user}', [BikeController::class, 'userBikes']);
