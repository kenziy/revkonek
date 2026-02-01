<?php

use App\Http\Controllers\Api\V1\Notifications\NotificationController;
use App\Http\Controllers\Api\V1\Notifications\NotificationPreferenceController;
use Illuminate\Support\Facades\Route;

// Notifications
Route::get('/', [NotificationController::class, 'index']);
Route::get('/unread', [NotificationController::class, 'unread']);
Route::get('/unread/count', [NotificationController::class, 'unreadCount']);
Route::post('/{notification}/read', [NotificationController::class, 'markAsRead']);
Route::post('/read-all', [NotificationController::class, 'markAllAsRead']);
Route::delete('/{notification}', [NotificationController::class, 'destroy']);

// Preferences
Route::get('/preferences', [NotificationPreferenceController::class, 'show']);
Route::put('/preferences', [NotificationPreferenceController::class, 'update']);

// Push tokens
Route::post('/push-token', [NotificationController::class, 'registerPushToken']);
Route::delete('/push-token', [NotificationController::class, 'removePushToken']);
