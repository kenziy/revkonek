<?php

use App\Http\Controllers\ClubController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmergencyContactController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SubscriptionController;
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

Route::post('/dashboard/skip-onboarding', [DashboardController::class, 'skipOnboarding'])
    ->middleware(['auth'])
    ->name('dashboard.skipOnboarding');

Route::get('/dashboard/feed', [DashboardController::class, 'feed'])
    ->middleware(['auth'])
    ->name('dashboard.feed');

Route::middleware('auth')->group(function () {
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/profile/privacy', fn () => Inertia::render('Profile/Privacy'))->name('profile.privacy');
    Route::get('/profile/sessions', fn () => Inertia::render('Profile/Sessions'))->name('profile.sessions');
    Route::post('/profile/cover-photo', [ProfileController::class, 'updateCoverPhoto'])->name('profile.updateCoverPhoto');
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.updateAvatar');
    Route::post('/profile/{user:uuid}/follow', [ProfileController::class, 'follow'])->name('profile.follow');
    Route::post('/profile/{user:uuid}/unfollow', [ProfileController::class, 'unfollow'])->name('profile.unfollow');

    // Subscription
    Route::get('/subscription', [SubscriptionController::class, 'index'])->name('subscription.index');
    Route::post('/subscription', [SubscriptionController::class, 'store'])->name('subscription.store');
    Route::post('/subscription/validate-coupon', [SubscriptionController::class, 'validateCoupon'])->name('subscription.validateCoupon');

    // Vehicles (replaces Garage)
    Route::get('/vehicles', [VehicleController::class, 'index'])->name('vehicles.index');
    Route::get('/vehicles/create', [VehicleController::class, 'create'])->name('vehicles.create');
    Route::post('/vehicles', [VehicleController::class, 'store'])->name('vehicles.store');
    Route::get('/vehicles/{vehicle}', [VehicleController::class, 'show'])->name('vehicles.show');
    Route::get('/vehicles/{vehicle}/edit', [VehicleController::class, 'edit'])->name('vehicles.edit');
    Route::put('/vehicles/{vehicle}', [VehicleController::class, 'update'])->name('vehicles.update');
    Route::delete('/vehicles/{vehicle}', [VehicleController::class, 'destroy'])->name('vehicles.destroy');
    Route::post('/vehicles/{vehicle}/set-active', [VehicleController::class, 'setActive'])->name('vehicles.setActive');
    // Vehicle Pro Customization
    Route::put('/vehicles/{vehicle}/customization', [VehicleController::class, 'updateCustomization'])->name('vehicles.customization.update');
    Route::post('/vehicles/{vehicle}/photos', [VehicleController::class, 'storePhotos'])->name('vehicles.photos.store');
    Route::delete('/vehicles/{vehicle}/photos/{photo}', [VehicleController::class, 'destroyPhoto'])->name('vehicles.photos.destroy');
    Route::post('/vehicles/{vehicle}/photos/reorder', [VehicleController::class, 'reorderPhotos'])->name('vehicles.photos.reorder');
    Route::post('/vehicles/{vehicle}/photos/{photo}/primary', [VehicleController::class, 'setPrimaryPhoto'])->name('vehicles.photos.setPrimary');
    Route::post('/vehicles/{vehicle}/mods', [VehicleController::class, 'storeMod'])->name('vehicles.mods.store');
    Route::put('/vehicles/{vehicle}/mods/{mod}', [VehicleController::class, 'updateMod'])->name('vehicles.mods.update');
    Route::delete('/vehicles/{vehicle}/mods/{mod}', [VehicleController::class, 'destroyMod'])->name('vehicles.mods.destroy');
    Route::post('/vehicles/{vehicle}/social-links', [VehicleController::class, 'storeSocialLink'])->name('vehicles.socialLinks.store');
    Route::delete('/vehicles/{vehicle}/social-links/{link}', [VehicleController::class, 'destroySocialLink'])->name('vehicles.socialLinks.destroy');
    Route::post('/vehicles/{vehicle}/like', [VehicleController::class, 'toggleLike'])->name('vehicles.toggleLike');

    // Legacy Garage routes (redirect to vehicles)
    Route::get('/garage', fn () => redirect()->route('vehicles.index'))->name('garage.index');
    Route::get('/garage/create', fn () => redirect()->route('vehicles.create'))->name('garage.create');
    Route::get('/garage/{bike}', fn ($bike) => redirect()->route('vehicles.show', $bike))->name('garage.show');
    Route::get('/garage/{bike}/edit', fn ($bike) => redirect()->route('vehicles.edit', $bike))->name('garage.edit');

    // Clubs
    Route::get('/clubs', [ClubController::class, 'index'])->name('clubs.index');
    Route::get('/clubs/create', [ClubController::class, 'create'])->name('clubs.create');
    Route::post('/clubs', [ClubController::class, 'store'])->name('clubs.store');
    Route::post('/clubs/check-slug', [ClubController::class, 'checkSlug'])->name('clubs.checkSlug');
    Route::get('/clubs/{club}/edit', [ClubController::class, 'edit'])->name('clubs.edit');
    Route::put('/clubs/{club}', [ClubController::class, 'update'])->name('clubs.update');
    Route::delete('/clubs/{club}', [ClubController::class, 'destroy'])->name('clubs.destroy');

    // Club membership
    Route::post('/clubs/{club}/join', [ClubController::class, 'join'])->name('clubs.join');
    Route::post('/clubs/{club}/leave', [ClubController::class, 'leave'])->name('clubs.leave');
    Route::post('/clubs/{club}/follow', [ClubController::class, 'follow'])->name('clubs.follow');
    Route::post('/clubs/{club}/unfollow', [ClubController::class, 'unfollow'])->name('clubs.unfollow');

    // Club members
    Route::get('/clubs/{club}/members', [ClubController::class, 'members'])->name('clubs.members');
    Route::put('/clubs/{club}/members/{member}/role', [ClubController::class, 'updateMemberRole'])->name('clubs.members.updateRole');
    Route::delete('/clubs/{club}/members/{member}', [ClubController::class, 'removeMember'])->name('clubs.members.remove');
    Route::post('/clubs/{club}/members/{member}/block', [ClubController::class, 'blockMember'])->name('clubs.members.block');
    Route::post('/clubs/{club}/members/{member}/unblock', [ClubController::class, 'unblockMember'])->name('clubs.members.unblock');
    Route::post('/clubs/{club}/members/{member}/mute', [ClubController::class, 'muteMember'])->name('clubs.members.mute');
    Route::post('/clubs/{club}/members/{member}/unmute', [ClubController::class, 'unmuteMember'])->name('clubs.members.unmute');

    // Club posts
    Route::post('/clubs/{club}/posts', [ClubController::class, 'storePost'])->name('clubs.posts.store');
    Route::delete('/clubs/{club}/posts/{post}', [ClubController::class, 'destroyPost'])->name('clubs.posts.destroy');
    Route::post('/clubs/{club}/posts/{post}/pin', [ClubController::class, 'pinPost'])->name('clubs.posts.pin');
    Route::post('/clubs/{club}/posts/{post}/unpin', [ClubController::class, 'unpinPost'])->name('clubs.posts.unpin');

    // Club events
    Route::get('/clubs/{club}/events', [ClubController::class, 'events'])->name('clubs.events');
    Route::get('/clubs/{club}/events/create', [ClubController::class, 'createEvent'])->name('clubs.events.create');
    Route::post('/clubs/{club}/events', [ClubController::class, 'storeEvent'])->name('clubs.events.store');
    Route::get('/clubs/{club}/events/{event}', [ClubController::class, 'showEvent'])->name('clubs.events.show');
    Route::post('/clubs/{club}/events/{event}/rsvp', [ClubController::class, 'rsvpEvent'])->name('clubs.events.rsvp');
    Route::post('/clubs/{club}/events/{event}/attendance', [ClubController::class, 'markAttendance'])->name('clubs.events.attendance');

    // Club chat
    Route::get('/clubs/{club}/chat', [ClubController::class, 'chat'])->name('clubs.chat');
    Route::post('/clubs/{club}/chat', [ClubController::class, 'sendMessage'])->name('clubs.chat.send');

    // Club invites
    Route::post('/clubs/{club}/invites', [ClubController::class, 'storeInvite'])->name('clubs.invites.store');

    // Club join requests
    Route::get('/clubs/{club}/requests', [ClubController::class, 'requests'])->name('clubs.requests');
    Route::post('/clubs/{club}/requests/{joinRequest}/approve', [ClubController::class, 'approveRequest'])->name('clubs.requests.approve');
    Route::post('/clubs/{club}/requests/{joinRequest}/reject', [ClubController::class, 'rejectRequest'])->name('clubs.requests.reject');

    // Club photos & cover
    Route::post('/clubs/{club}/cover-image', [ClubController::class, 'updateCoverImage'])->name('clubs.updateCoverImage');
    Route::post('/clubs/{club}/avatar', [ClubController::class, 'updateAvatar'])->name('clubs.updateAvatar');
    Route::post('/clubs/{club}/photos', [ClubController::class, 'storePhotos'])->name('clubs.photos.store');
    Route::delete('/clubs/{club}/photos/{photo}', [ClubController::class, 'destroyPhoto'])->name('clubs.photos.destroy');

    // Club settings
    Route::get('/clubs/{club}/settings', [ClubController::class, 'settings'])->name('clubs.settings');

    // Club subscription
    Route::get('/clubs/{club}/subscription', [ClubController::class, 'subscription'])->name('clubs.subscription');
    Route::post('/clubs/{club}/subscription', [ClubController::class, 'storeSubscription'])->name('clubs.subscription.store');
    Route::post('/clubs/{club}/subscription/validate-coupon', [ClubController::class, 'validateCoupon'])->name('clubs.subscription.validateCoupon');

    // Legacy Groups routes (redirect to clubs)
    Route::get('/groups', fn () => redirect()->route('clubs.index'))->name('groups.index');
    Route::get('/groups/create', fn () => redirect()->route('clubs.create'));
    Route::get('/groups/{id}', fn ($id) => redirect()->route('clubs.show', $id));

    // SOS / Emergency
    Route::middleware('feature:sos')->group(function () {
        Route::get('/sos', fn () => Inertia::render('SOS/Index'))->name('sos.index');
        Route::get('/sos/trigger', fn () => Inertia::render('SOS/Trigger'))->name('sos.trigger');
        Route::get('/sos/contacts', [EmergencyContactController::class, 'index'])->name('sos.contacts');
        Route::post('/sos/contacts', [EmergencyContactController::class, 'store'])->name('sos.contacts.store');
        Route::put('/sos/contacts/{contact}', [EmergencyContactController::class, 'update'])->name('sos.contacts.update');
        Route::delete('/sos/contacts/{contact}', [EmergencyContactController::class, 'destroy'])->name('sos.contacts.destroy');
        Route::post('/sos/contacts/reorder', [EmergencyContactController::class, 'reorder'])->name('sos.contacts.reorder');
        Route::get('/sos/medical', fn () => Inertia::render('SOS/Medical'))->name('sos.medical');
        Route::get('/sos/settings', fn () => Inertia::render('SOS/Settings'))->name('sos.settings');
    });

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

// Public profiles (accessible without login)
Route::get('/profile/{user:uuid}', [ProfileController::class, 'show'])->name('profile.show');

// Public club profile (accessible without login — must be after /clubs/create to avoid wildcard conflict)
Route::get('/clubs/{club}', [ClubController::class, 'show'])->name('clubs.show');

require __DIR__.'/auth.php';
