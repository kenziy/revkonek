<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmergencyContactController;
use App\Http\Controllers\MatchController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VehicleController;
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

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/profile/privacy', fn () => Inertia::render('Profile/Privacy'))->name('profile.privacy');
    Route::get('/profile/sessions', fn () => Inertia::render('Profile/Sessions'))->name('profile.sessions');

    // Vehicles (replaces Garage)
    Route::get('/vehicles', [VehicleController::class, 'index'])->name('vehicles.index');
    Route::get('/vehicles/create', [VehicleController::class, 'create'])->name('vehicles.create');
    Route::post('/vehicles', [VehicleController::class, 'store'])->name('vehicles.store');
    Route::get('/vehicles/{vehicle}', [VehicleController::class, 'show'])->name('vehicles.show');
    Route::get('/vehicles/{vehicle}/edit', [VehicleController::class, 'edit'])->name('vehicles.edit');
    Route::put('/vehicles/{vehicle}', [VehicleController::class, 'update'])->name('vehicles.update');
    Route::delete('/vehicles/{vehicle}', [VehicleController::class, 'destroy'])->name('vehicles.destroy');
    Route::post('/vehicles/{vehicle}/set-active', [VehicleController::class, 'setActive'])->name('vehicles.setActive');
    Route::post('/vehicles/{vehicle}/toggle-match', [VehicleController::class, 'toggleMatchAvailability'])->name('vehicles.toggleMatch');

    // Legacy Garage routes (redirect to vehicles)
    Route::get('/garage', fn () => redirect()->route('vehicles.index'))->name('garage.index');
    Route::get('/garage/create', fn () => redirect()->route('vehicles.create'))->name('garage.create');
    Route::get('/garage/{bike}', fn ($bike) => redirect()->route('vehicles.show', $bike))->name('garage.show');
    Route::get('/garage/{bike}/edit', fn ($bike) => redirect()->route('vehicles.edit', $bike))->name('garage.edit');

    // Challenges
    Route::get('/challenges', fn () => Inertia::render('Challenges/Index'))->name('challenges.index');
    Route::get('/challenges/create', fn () => Inertia::render('Challenges/Create'))->name('challenges.create');
    Route::get('/challenges/{id}', fn ($id) => Inertia::render('Challenges/Show', ['id' => $id]))->name('challenges.show');

    // Match / Find Riders
    Route::get('/match', [MatchController::class, 'index'])->name('match.index');
    Route::post('/match/toggle-status', [MatchController::class, 'toggleStatus'])->name('match.toggleStatus');
    Route::post('/match/vehicle/{vehicle}/toggle', [MatchController::class, 'toggleVehicleStatus'])->name('match.toggleVehicleStatus');

    // Groups
    Route::get('/groups', fn () => Inertia::render('Groups/Index'))->name('groups.index');
    Route::get('/groups/create', fn () => Inertia::render('Groups/Create'))->name('groups.create');
    Route::get('/groups/{id}', fn ($id) => Inertia::render('Groups/Show', ['id' => $id]))->name('groups.show');

    // SOS / Emergency
    Route::get('/sos', fn () => Inertia::render('SOS/Index'))->name('sos.index');
    Route::get('/sos/trigger', fn () => Inertia::render('SOS/Trigger'))->name('sos.trigger');
    Route::get('/sos/contacts', [EmergencyContactController::class, 'index'])->name('sos.contacts');
    Route::post('/sos/contacts', [EmergencyContactController::class, 'store'])->name('sos.contacts.store');
    Route::put('/sos/contacts/{contact}', [EmergencyContactController::class, 'update'])->name('sos.contacts.update');
    Route::delete('/sos/contacts/{contact}', [EmergencyContactController::class, 'destroy'])->name('sos.contacts.destroy');
    Route::post('/sos/contacts/reorder', [EmergencyContactController::class, 'reorder'])->name('sos.contacts.reorder');
    Route::get('/sos/medical', fn () => Inertia::render('SOS/Medical'))->name('sos.medical');
    Route::get('/sos/settings', fn () => Inertia::render('SOS/Settings'))->name('sos.settings');

    // Shop / Marketplace
    Route::get('/shop', fn () => Inertia::render('Shop/Index'))->name('shop.index');
    Route::get('/shop/{id}', fn ($id) => Inertia::render('Shop/Show', ['id' => $id]))->name('shop.show');
    Route::get('/shop/listing/{id}', fn ($id) => Inertia::render('Shop/Listing', ['id' => $id]))->name('shop.listing');

    // Notifications
    Route::get('/notifications', fn () => Inertia::render('Notifications/Index'))->name('notifications.index');
    Route::get('/notifications/settings', fn () => Inertia::render('Notifications/Settings'))->name('notifications.settings');
    Route::post('/notifications/mark-all-read', fn () => back())->name('notifications.markAllRead');
    Route::post('/notifications/{id}/mark-read', fn ($id) => back())->name('notifications.markRead');
});

require __DIR__.'/auth.php';
