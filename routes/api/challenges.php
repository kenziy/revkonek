<?php

use App\Http\Controllers\Api\V1\Challenges\ChallengeChatController;
use App\Http\Controllers\Api\V1\Challenges\ChallengeController;
use App\Http\Controllers\Api\V1\Challenges\ChallengeDisputeController;
use App\Http\Controllers\Api\V1\Challenges\ChallengeResultController;
use App\Http\Controllers\Api\V1\Challenges\ChallengeWitnessController;
use Illuminate\Support\Facades\Route;

// Challenge CRUD
Route::get('/', [ChallengeController::class, 'index']);
Route::post('/', [ChallengeController::class, 'store']);
Route::get('/{challenge}', [ChallengeController::class, 'show']);
Route::put('/{challenge}', [ChallengeController::class, 'update']);
Route::delete('/{challenge}', [ChallengeController::class, 'destroy']);

// Challenge actions
Route::post('/{challenge}/accept', [ChallengeController::class, 'accept']);
Route::post('/{challenge}/decline', [ChallengeController::class, 'decline']);
Route::post('/{challenge}/counter', [ChallengeController::class, 'counter']);
Route::post('/{challenge}/confirm', [ChallengeController::class, 'confirm']);
Route::post('/{challenge}/cancel', [ChallengeController::class, 'cancel']);

// Results
Route::prefix('{challenge}/results')->group(function () {
    Route::post('/', [ChallengeResultController::class, 'store']);
    Route::get('/', [ChallengeResultController::class, 'show']);
});

// Disputes
Route::prefix('{challenge}/disputes')->group(function () {
    Route::post('/', [ChallengeDisputeController::class, 'store']);
    Route::get('/', [ChallengeDisputeController::class, 'show']);
    Route::post('/evidence', [ChallengeDisputeController::class, 'addEvidence']);
    Route::post('/resolve', [ChallengeDisputeController::class, 'resolve'])
        ->middleware('can:resolve-disputes');
});

// Chat
Route::prefix('{challenge}/chat')->group(function () {
    Route::get('/', [ChallengeChatController::class, 'index']);
    Route::post('/', [ChallengeChatController::class, 'store']);
});

// Witnesses
Route::prefix('{challenge}/witnesses')->group(function () {
    Route::get('/', [ChallengeWitnessController::class, 'index']);
    Route::post('/', [ChallengeWitnessController::class, 'store']);
    Route::post('/verify', [ChallengeWitnessController::class, 'verify']);
});

// User stats
Route::get('/users/{user}/stats', [ChallengeController::class, 'userStats']);
