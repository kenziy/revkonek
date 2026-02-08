<?php

use App\Http\Controllers\Api\V1\Clubs\ClubChatController;
use App\Http\Controllers\Api\V1\Clubs\ClubController;
use App\Http\Controllers\Api\V1\Clubs\ClubEventController;
use App\Http\Controllers\Api\V1\Clubs\ClubInviteController;
use App\Http\Controllers\Api\V1\Clubs\ClubMemberController;
use App\Http\Controllers\Api\V1\Clubs\ClubPostController;
use Illuminate\Support\Facades\Route;

// Clubs CRUD
Route::get('/', [ClubController::class, 'index']);
Route::post('/', [ClubController::class, 'store']);
Route::get('/{club}', [ClubController::class, 'show']);
Route::put('/{club}', [ClubController::class, 'update']);
Route::delete('/{club}', [ClubController::class, 'destroy']);

// Club actions
Route::post('/{club}/join', [ClubController::class, 'join']);
Route::post('/{club}/leave', [ClubController::class, 'leave']);
Route::post('/{club}/follow', [ClubController::class, 'follow']);
Route::post('/{club}/unfollow', [ClubController::class, 'unfollow']);
Route::get('/my', [ClubController::class, 'myClubs']);
Route::get('/discover', [ClubController::class, 'discover']);

// Members
Route::prefix('{club}/members')->group(function () {
    Route::get('/', [ClubMemberController::class, 'index']);
    Route::put('/{member}/role', [ClubMemberController::class, 'updateRole']);
    Route::delete('/{member}', [ClubMemberController::class, 'remove']);
    Route::post('/{member}/mute', [ClubMemberController::class, 'mute']);
    Route::post('/{member}/unmute', [ClubMemberController::class, 'unmute']);
    Route::post('/{member}/block', [ClubMemberController::class, 'block']);
    Route::post('/{member}/unblock', [ClubMemberController::class, 'unblock']);
});

// Posts
Route::prefix('{club}/posts')->group(function () {
    Route::get('/', [ClubPostController::class, 'index']);
    Route::post('/', [ClubPostController::class, 'store']);
    Route::get('/{post}', [ClubPostController::class, 'show']);
    Route::put('/{post}', [ClubPostController::class, 'update']);
    Route::delete('/{post}', [ClubPostController::class, 'destroy']);
    Route::post('/{post}/pin', [ClubPostController::class, 'pin']);
    Route::post('/{post}/unpin', [ClubPostController::class, 'unpin']);
});

// Events
Route::prefix('{club}/events')->group(function () {
    Route::get('/', [ClubEventController::class, 'index']);
    Route::post('/', [ClubEventController::class, 'store']);
    Route::get('/{event}', [ClubEventController::class, 'show']);
    Route::put('/{event}', [ClubEventController::class, 'update']);
    Route::delete('/{event}', [ClubEventController::class, 'destroy']);
    Route::post('/{event}/rsvp', [ClubEventController::class, 'rsvp']);
});

// Chat
Route::prefix('{club}/chat')->group(function () {
    Route::get('/', [ClubChatController::class, 'index']);
    Route::post('/', [ClubChatController::class, 'store']);
});

// Invites
Route::prefix('{club}/invites')->group(function () {
    Route::get('/', [ClubInviteController::class, 'index']);
    Route::post('/', [ClubInviteController::class, 'store']);
    Route::delete('/{invite}', [ClubInviteController::class, 'destroy']);
});

// Join requests (for private clubs)
Route::prefix('{club}/requests')->group(function () {
    Route::get('/', [ClubController::class, 'requests']);
    Route::post('/{request}/approve', [ClubController::class, 'approveRequest']);
    Route::post('/{request}/reject', [ClubController::class, 'rejectRequest']);
});
