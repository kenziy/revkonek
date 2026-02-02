<?php

use App\Http\Controllers\Api\V1\Profiles\PrivacyController;
use App\Http\Controllers\Api\V1\Profiles\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/me', [ProfileController::class, 'show']);
Route::put('/me', [ProfileController::class, 'update']);
Route::post('/me/avatar', [ProfileController::class, 'updateAvatar']);
Route::delete('/me/avatar', [ProfileController::class, 'destroyAvatar']);

// Privacy settings
Route::get('/me/privacy', [PrivacyController::class, 'show']);
Route::put('/me/privacy', [PrivacyController::class, 'update']);

// View other profiles
Route::get('/{username}', [ProfileController::class, 'showByUsername']);
