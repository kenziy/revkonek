<?php

use App\Http\Controllers\Api\V1\Matches\MatchController;
use App\Http\Controllers\Api\V1\Matches\MatchPreferenceController;
use App\Http\Controllers\Api\V1\Matches\AvailabilityController;
use Illuminate\Support\Facades\Route;

// Match suggestions
Route::get('/', [MatchController::class, 'index']);
Route::get('/nearby', [MatchController::class, 'nearby']);
Route::post('/refresh', [MatchController::class, 'refresh']);

// Match preferences
Route::get('/preferences', [MatchPreferenceController::class, 'show']);
Route::put('/preferences', [MatchPreferenceController::class, 'update']);

// Availability
Route::get('/availability', [AvailabilityController::class, 'show']);
Route::put('/availability', [AvailabilityController::class, 'update']);
Route::post('/availability/looking', [AvailabilityController::class, 'toggleLooking']);

// Match history
Route::get('/history', [MatchController::class, 'history']);
