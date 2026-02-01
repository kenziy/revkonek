<?php

use App\Http\Controllers\Api\V1\Sos\SosAlertController;
use App\Http\Controllers\Api\V1\Sos\SosResponseController;
use App\Http\Controllers\Api\V1\Sos\EmergencyContactController;
use App\Http\Controllers\Api\V1\Sos\MedicalProfileController;
use App\Http\Controllers\Api\V1\Sos\TrustedResponderController;
use Illuminate\Support\Facades\Route;

// SOS Alerts
Route::post('/trigger', [SosAlertController::class, 'trigger']);
Route::post('/cancel', [SosAlertController::class, 'cancel']);
Route::get('/active', [SosAlertController::class, 'active']);
Route::put('/location', [SosAlertController::class, 'updateLocation']);
Route::get('/history', [SosAlertController::class, 'history']);
Route::post('/test', [SosAlertController::class, 'test']);

// SOS Responses
Route::get('/alerts', [SosResponseController::class, 'nearbyAlerts']);
Route::post('/alerts/{alert}/respond', [SosResponseController::class, 'respond']);
Route::put('/alerts/{alert}/status', [SosResponseController::class, 'updateStatus']);

// Emergency Contacts
Route::prefix('contacts')->group(function () {
    Route::get('/', [EmergencyContactController::class, 'index']);
    Route::post('/', [EmergencyContactController::class, 'store']);
    Route::put('/{contact}', [EmergencyContactController::class, 'update']);
    Route::delete('/{contact}', [EmergencyContactController::class, 'destroy']);
});

// Medical Profile
Route::get('/medical', [MedicalProfileController::class, 'show']);
Route::put('/medical', [MedicalProfileController::class, 'update']);

// Trusted Responders
Route::prefix('responders')->group(function () {
    Route::get('/', [TrustedResponderController::class, 'index']);
    Route::post('/{user}', [TrustedResponderController::class, 'store']);
    Route::delete('/{user}', [TrustedResponderController::class, 'destroy']);
});

// SOS Settings
Route::get('/settings', [SosAlertController::class, 'settings']);
Route::put('/settings', [SosAlertController::class, 'updateSettings']);
