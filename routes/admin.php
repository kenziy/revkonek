<?php

use App\Http\Controllers\Admin\AdminAuditLogController;
use App\Http\Controllers\Admin\AdminClubController;
use App\Http\Controllers\Admin\AdminClubSubscriptionController;
use App\Http\Controllers\Admin\AdminContentController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminSettingsController;
use App\Http\Controllers\Admin\AdminShopController;
use App\Http\Controllers\Admin\AdminSubscriptionController;
use App\Http\Controllers\Admin\AdminUserController;
use Illuminate\Support\Facades\Route;

// Dashboard
Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

// Users
Route::prefix('users')->name('users.')->group(function () {
    Route::get('/', [AdminUserController::class, 'index'])->name('index');
    Route::get('/{user}', [AdminUserController::class, 'show'])->name('show');
    Route::put('/{user}', [AdminUserController::class, 'update'])->name('update');
    Route::post('/{user}/ban', [AdminUserController::class, 'ban'])->name('ban');
    Route::post('/{user}/unban', [AdminUserController::class, 'unban'])->name('unban');
    Route::post('/{user}/verify', [AdminUserController::class, 'verify'])->name('verify');
    Route::post('/{user}/sync-roles', [AdminUserController::class, 'syncRoles'])->name('syncRoles');
});

// Clubs
Route::prefix('clubs')->name('clubs.')->group(function () {
    Route::get('/', [AdminClubController::class, 'index'])->name('index');
    Route::get('/{club}', [AdminClubController::class, 'show'])->name('show');
    Route::put('/{club}', [AdminClubController::class, 'update'])->name('update');
    Route::post('/{club}/archive', [AdminClubController::class, 'archive'])->name('archive');
    Route::post('/{club}/unarchive', [AdminClubController::class, 'unarchive'])->name('unarchive');
    Route::post('/{club}/verify', [AdminClubController::class, 'verify'])->name('verify');
    Route::delete('/{club}', [AdminClubController::class, 'destroy'])->name('destroy');
});

// Shops
Route::prefix('shops')->name('shops.')->group(function () {
    Route::get('/', [AdminShopController::class, 'index'])->name('index');
    Route::get('/{shop}', [AdminShopController::class, 'show'])->name('show');
    Route::post('/{shop}/verify', [AdminShopController::class, 'verify'])->name('verify');
    Route::post('/{shop}/reject', [AdminShopController::class, 'reject'])->name('reject');
    Route::post('/{shop}/toggle-active', [AdminShopController::class, 'toggleActive'])->name('toggleActive');
});

// Subscriptions
Route::prefix('subscriptions')->name('subscriptions.')->group(function () {
    Route::get('/', [AdminSubscriptionController::class, 'index'])->name('index');
    Route::get('/plans', [AdminSubscriptionController::class, 'plans'])->name('plans');
    Route::post('/plans', [AdminSubscriptionController::class, 'storePlan'])->name('plans.store');
    Route::put('/plans/{plan}', [AdminSubscriptionController::class, 'updatePlan'])->name('plans.update');
    Route::delete('/plans/{plan}', [AdminSubscriptionController::class, 'deletePlan'])->name('plans.destroy');
    Route::post('/users/{user}/grant-pro', [AdminSubscriptionController::class, 'grantPro'])->name('grantPro');
    Route::post('/users/{user}/revoke-pro', [AdminSubscriptionController::class, 'revokePro'])->name('revokePro');
    Route::get('/coupons', [AdminSubscriptionController::class, 'coupons'])->name('coupons');
    Route::post('/coupons', [AdminSubscriptionController::class, 'storeCoupon'])->name('coupons.store');
    Route::put('/coupons/{coupon}', [AdminSubscriptionController::class, 'updateCoupon'])->name('coupons.update');
    Route::post('/coupons/{coupon}/toggle', [AdminSubscriptionController::class, 'toggleCoupon'])->name('coupons.toggle');
    Route::delete('/coupons/{coupon}', [AdminSubscriptionController::class, 'destroyCoupon'])->name('coupons.destroy');
    Route::get('/{subscription}', [AdminSubscriptionController::class, 'show'])->name('show');
    Route::post('/{subscription}/verify', [AdminSubscriptionController::class, 'verify'])->name('verify');
});

// Club Subscriptions
Route::prefix('club-subscriptions')->name('club-subscriptions.')->group(function () {
    Route::get('/', [AdminClubSubscriptionController::class, 'index'])->name('index');
    Route::get('/pricing', [AdminClubSubscriptionController::class, 'pricing'])->name('pricing');
    Route::put('/pricing', [AdminClubSubscriptionController::class, 'updatePricing'])->name('pricing.update');
    Route::get('/coupons', [AdminClubSubscriptionController::class, 'coupons'])->name('coupons');
    Route::post('/coupons', [AdminClubSubscriptionController::class, 'storeCoupon'])->name('coupons.store');
    Route::put('/coupons/{coupon}', [AdminClubSubscriptionController::class, 'updateCoupon'])->name('coupons.update');
    Route::post('/coupons/{coupon}/toggle', [AdminClubSubscriptionController::class, 'toggleCoupon'])->name('coupons.toggle');
    Route::delete('/coupons/{coupon}', [AdminClubSubscriptionController::class, 'destroyCoupon'])->name('coupons.destroy');
    Route::get('/{subscription}', [AdminClubSubscriptionController::class, 'show'])->name('show');
    Route::post('/{subscription}/verify', [AdminClubSubscriptionController::class, 'verify'])->name('verify');
});

// Content
Route::prefix('content')->name('content.')->group(function () {
    Route::get('/', [AdminContentController::class, 'index'])->name('index');
    Route::delete('/{type}/{id}', [AdminContentController::class, 'destroy'])->name('destroy');
});

// Settings
Route::prefix('settings')->name('settings.')->group(function () {
    Route::get('/', [AdminSettingsController::class, 'index'])->name('index');
    Route::put('/', [AdminSettingsController::class, 'update'])->name('update');
    Route::get('/staff', [AdminSettingsController::class, 'staff'])->name('staff');
    Route::post('/staff/{user}/assign-role', [AdminSettingsController::class, 'assignRole'])->name('assignRole');
    Route::post('/staff/{user}/revoke-role', [AdminSettingsController::class, 'revokeRole'])->name('revokeRole');
    Route::get('/features', [AdminSettingsController::class, 'features'])->name('features');
    Route::put('/features', [AdminSettingsController::class, 'updateFeatures'])->name('features.update');
});

// Audit Logs
Route::get('/audit-logs', [AdminAuditLogController::class, 'index'])->name('audit-logs.index');
