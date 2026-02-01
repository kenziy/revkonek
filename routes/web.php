<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/profile/privacy', fn() => Inertia::render('Profile/Privacy'))->name('profile.privacy');
    Route::get('/profile/sessions', fn() => Inertia::render('Profile/Sessions'))->name('profile.sessions');

    // Garage
    Route::get('/garage', fn() => Inertia::render('Garage/Index'))->name('garage.index');
    Route::get('/garage/create', fn() => Inertia::render('Garage/Create'))->name('garage.create');
    Route::get('/garage/{id}', fn($id) => Inertia::render('Garage/Show', ['id' => $id]))->name('garage.show');
    Route::get('/garage/{id}/edit', fn($id) => Inertia::render('Garage/Edit', ['id' => $id]))->name('garage.edit');

    // Challenges
    Route::get('/challenges', fn() => Inertia::render('Challenges/Index'))->name('challenges.index');
    Route::get('/challenges/create', fn() => Inertia::render('Challenges/Create'))->name('challenges.create');
    Route::get('/challenges/{id}', fn($id) => Inertia::render('Challenges/Show', ['id' => $id]))->name('challenges.show');

    // Match / Find Riders
    Route::get('/match', fn() => Inertia::render('Match/Index'))->name('match.index');

    // Groups
    Route::get('/groups', fn() => Inertia::render('Groups/Index'))->name('groups.index');
    Route::get('/groups/create', fn() => Inertia::render('Groups/Create'))->name('groups.create');
    Route::get('/groups/{id}', fn($id) => Inertia::render('Groups/Show', ['id' => $id]))->name('groups.show');

    // SOS / Emergency
    Route::get('/sos', fn() => Inertia::render('SOS/Index'))->name('sos.index');
    Route::get('/sos/trigger', fn() => Inertia::render('SOS/Trigger'))->name('sos.trigger');
    Route::get('/sos/contacts', fn() => Inertia::render('SOS/Contacts'))->name('sos.contacts');
    Route::get('/sos/medical', fn() => Inertia::render('SOS/Medical'))->name('sos.medical');
    Route::get('/sos/settings', fn() => Inertia::render('SOS/Settings'))->name('sos.settings');

    // Shop / Marketplace
    Route::get('/shop', fn() => Inertia::render('Shop/Index'))->name('shop.index');
    Route::get('/shop/{id}', fn($id) => Inertia::render('Shop/Show', ['id' => $id]))->name('shop.show');
    Route::get('/shop/listing/{id}', fn($id) => Inertia::render('Shop/Listing', ['id' => $id]))->name('shop.listing');

    // Notifications
    Route::get('/notifications', fn() => Inertia::render('Notifications/Index'))->name('notifications.index');
    Route::get('/notifications/settings', fn() => Inertia::render('Notifications/Settings'))->name('notifications.settings');
    Route::post('/notifications/mark-all-read', fn() => back())->name('notifications.markAllRead');
    Route::post('/notifications/{id}/mark-read', fn($id) => back())->name('notifications.markRead');
});

require __DIR__.'/auth.php';
