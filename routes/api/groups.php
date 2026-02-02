<?php

use App\Http\Controllers\Api\V1\Groups\GroupChatController;
use App\Http\Controllers\Api\V1\Groups\GroupController;
use App\Http\Controllers\Api\V1\Groups\GroupEventController;
use App\Http\Controllers\Api\V1\Groups\GroupInviteController;
use App\Http\Controllers\Api\V1\Groups\GroupMemberController;
use App\Http\Controllers\Api\V1\Groups\GroupPostController;
use Illuminate\Support\Facades\Route;

// Groups CRUD
Route::get('/', [GroupController::class, 'index']);
Route::post('/', [GroupController::class, 'store']);
Route::get('/{group}', [GroupController::class, 'show']);
Route::put('/{group}', [GroupController::class, 'update']);
Route::delete('/{group}', [GroupController::class, 'destroy']);

// Group actions
Route::post('/{group}/join', [GroupController::class, 'join']);
Route::post('/{group}/leave', [GroupController::class, 'leave']);
Route::get('/my', [GroupController::class, 'myGroups']);
Route::get('/discover', [GroupController::class, 'discover']);

// Members
Route::prefix('{group}/members')->group(function () {
    Route::get('/', [GroupMemberController::class, 'index']);
    Route::put('/{member}/role', [GroupMemberController::class, 'updateRole']);
    Route::delete('/{member}', [GroupMemberController::class, 'remove']);
    Route::post('/{member}/mute', [GroupMemberController::class, 'mute']);
    Route::post('/{member}/unmute', [GroupMemberController::class, 'unmute']);
});

// Posts
Route::prefix('{group}/posts')->group(function () {
    Route::get('/', [GroupPostController::class, 'index']);
    Route::post('/', [GroupPostController::class, 'store']);
    Route::get('/{post}', [GroupPostController::class, 'show']);
    Route::put('/{post}', [GroupPostController::class, 'update']);
    Route::delete('/{post}', [GroupPostController::class, 'destroy']);
    Route::post('/{post}/pin', [GroupPostController::class, 'pin']);
    Route::post('/{post}/unpin', [GroupPostController::class, 'unpin']);
});

// Events
Route::prefix('{group}/events')->group(function () {
    Route::get('/', [GroupEventController::class, 'index']);
    Route::post('/', [GroupEventController::class, 'store']);
    Route::get('/{event}', [GroupEventController::class, 'show']);
    Route::put('/{event}', [GroupEventController::class, 'update']);
    Route::delete('/{event}', [GroupEventController::class, 'destroy']);
    Route::post('/{event}/rsvp', [GroupEventController::class, 'rsvp']);
});

// Chat
Route::prefix('{group}/chat')->group(function () {
    Route::get('/', [GroupChatController::class, 'index']);
    Route::post('/', [GroupChatController::class, 'store']);
});

// Invites
Route::prefix('{group}/invites')->group(function () {
    Route::get('/', [GroupInviteController::class, 'index']);
    Route::post('/', [GroupInviteController::class, 'store']);
    Route::delete('/{invite}', [GroupInviteController::class, 'destroy']);
});

// Join requests (for private groups)
Route::prefix('{group}/requests')->group(function () {
    Route::get('/', [GroupController::class, 'requests']);
    Route::post('/{request}/approve', [GroupController::class, 'approveRequest']);
    Route::post('/{request}/reject', [GroupController::class, 'rejectRequest']);
});
