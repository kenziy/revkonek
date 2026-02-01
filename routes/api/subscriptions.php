<?php

use App\Http\Controllers\Api\V1\Subscriptions\SubscriptionController;
use App\Http\Controllers\Api\V1\Subscriptions\PlanController;
use Illuminate\Support\Facades\Route;

// Plans
Route::get('/plans', [PlanController::class, 'index']);
Route::get('/plans/{plan}', [PlanController::class, 'show']);

// Current subscription
Route::get('/current', [SubscriptionController::class, 'current']);
Route::get('/features', [SubscriptionController::class, 'features']);

// Subscription management
Route::post('/subscribe', [SubscriptionController::class, 'subscribe']);
Route::post('/cancel', [SubscriptionController::class, 'cancel']);
Route::post('/resume', [SubscriptionController::class, 'resume']);
Route::post('/change-plan', [SubscriptionController::class, 'changePlan']);

// Billing history
Route::get('/invoices', [SubscriptionController::class, 'invoices']);
Route::get('/invoices/{invoice}', [SubscriptionController::class, 'invoice']);
