<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| REV KONEK API v1 Routes
|
*/

Route::prefix('v1')->group(function () {
    // Auth routes
    Route::prefix('auth')->group(base_path('routes/api/auth.php'));

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        // Users
        Route::prefix('users')->group(base_path('routes/api/users.php'));

        // Profiles
        Route::prefix('profiles')->group(base_path('routes/api/profiles.php'));

        // Bikes/Garage
        Route::prefix('bikes')->group(base_path('routes/api/bikes.php'));

        // Challenges
        Route::prefix('challenges')->group(base_path('routes/api/challenges.php'));

        // Matchmaking
        Route::prefix('matches')->group(base_path('routes/api/matches.php'));

        // SOS/Emergency
        Route::prefix('sos')->group(base_path('routes/api/sos.php'));

        // Groups
        Route::prefix('groups')->group(base_path('routes/api/groups.php'));

        // Shops
        Route::prefix('shops')->group(base_path('routes/api/shops.php'));

        // Listings
        Route::prefix('listings')->group(base_path('routes/api/listings.php'));

        // Subscriptions
        Route::prefix('subscriptions')->group(base_path('routes/api/subscriptions.php'));

        // Notifications
        Route::prefix('notifications')->group(base_path('routes/api/notifications.php'));
    });
});
