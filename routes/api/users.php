<?php

use App\Http\Controllers\Api\V1\Users\UserController;
use App\Http\Controllers\Api\V1\Users\BlockController;
use App\Http\Controllers\Api\V1\Users\ConnectionController;
use Illuminate\Support\Facades\Route;

Route::get('/me', [UserController::class, 'me']);
Route::put('/me', [UserController::class, 'update']);
Route::delete('/me', [UserController::class, 'destroy']);
Route::put('/me/password', [UserController::class, 'updatePassword']);

// User discovery
Route::get('/', [UserController::class, 'index']);
Route::get('/{user}', [UserController::class, 'show']);

// Blocking
Route::prefix('blocks')->group(function () {
    Route::get('/', [BlockController::class, 'index']);
    Route::post('/{user}', [BlockController::class, 'store']);
    Route::delete('/{user}', [BlockController::class, 'destroy']);
});

// Connections
Route::prefix('connections')->group(function () {
    Route::get('/', [ConnectionController::class, 'index']);
    Route::post('/{user}', [ConnectionController::class, 'store']);
    Route::put('/{user}', [ConnectionController::class, 'update']);
    Route::delete('/{user}', [ConnectionController::class, 'destroy']);
});
