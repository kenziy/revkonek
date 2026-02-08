<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Subscription\Subscription;
use App\Models\User;
use App\Models\Vehicle;
use App\Services\UserService;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function __construct(
        private readonly UserService $userService,
    ) {}

    /**
     * Display a user's public profile.
     */
    public function show(User $user): Response
    {
        abort_unless($user->is_active, 404);

        $authUser = Auth::user();
        $isOwner = $authUser && $authUser->id === $user->id;
        $isGuest = ! Auth::check();

        $user->load('profile');
        $user->loadCount(['followers', 'following']);

        // Pre-load liked vehicle IDs to avoid N+1
        $likedVehicleIds = $authUser ? $authUser->likedVehicles()->pluck('vehicle_id')->all() : [];

        $vehicles = Vehicle::where('user_id', $user->id)
            ->active()
            ->with(['vehicleType', 'category', 'primaryPhoto'])
            ->withCount('likedBy')
            ->latest()
            ->get()
            ->map(fn (Vehicle $v) => [
                'uuid' => $v->uuid,
                'displayName' => $v->display_name,
                'engineSpec' => $v->engine_spec,
                'make' => $v->make,
                'model' => $v->model,
                'year' => $v->year,
                'color' => $v->color,
                'vehicleType' => $v->vehicleType?->name,
                'category' => $v->category?->name,
                'photo' => $v->primaryPhoto?->path ? '/storage/'.$v->primaryPhoto->path : null,
                'modificationLevel' => $v->modification_level,
                'likesCount' => $v->liked_by_count,
                'isLiked' => in_array($v->id, $likedVehicleIds),
            ]);

        $clubs = $user->clubs()
            ->where('is_archived', false)
            ->where('type', '!=', 'secret')
            ->withCount('members')
            ->get()
            ->map(fn ($club) => [
                'slug' => $club->slug,
                'name' => $club->name,
                'avatar' => $club->avatar,
                'type' => $club->type,
                'is_premium' => $club->is_premium,
                'members_count' => $club->members_count,
                'role' => $club->pivot->role,
            ]);

        // Followers / Following lists
        $followingIds = $authUser ? $authUser->following()->pluck('user_id')->all() : [];

        $followers = $user->followers()
            ->with('profile')
            ->limit(50)
            ->get()
            ->map(fn (User $u) => [
                'uuid' => $u->uuid,
                'display_name' => $u->display_name,
                'username' => $u->username,
                'avatar' => $u->profile?->avatar,
                'is_premium' => $u->isPremium(),
                'isFollowing' => in_array($u->id, $followingIds),
                'isOwn' => $authUser && $authUser->id === $u->id,
            ]);

        $followingUsers = $user->following()
            ->with('profile')
            ->limit(50)
            ->get()
            ->map(fn (User $u) => [
                'uuid' => $u->uuid,
                'display_name' => $u->display_name,
                'username' => $u->username,
                'avatar' => $u->profile?->avatar,
                'is_premium' => $u->isPremium(),
                'isFollowing' => in_array($u->id, $followingIds),
                'isOwn' => $authUser && $authUser->id === $u->id,
            ]);

        return Inertia::render('Profile/Show', [
            'profileUser' => [
                'uuid' => $user->uuid,
                'name' => $user->name,
                'username' => $user->username,
                'display_name' => $user->display_name,
                'avatar' => $user->profile?->avatar,
                'cover_photo' => $user->cover_photo,
                'bio' => $user->profile?->bio,
                'city' => $user->profile?->city,
                'province' => $user->profile?->province,
                'riding_experience_years' => $user->profile?->riding_experience_years,
                'riding_style' => $user->profile?->riding_style,
                'is_premium' => $user->isPremium(),
                'member_since' => $user->created_at->format('M Y'),
                'followers_count' => $user->followers_count,
                'following_count' => $user->following_count,
            ],
            'vehicles' => $vehicles,
            'clubs' => $clubs,
            'isOwner' => $isOwner,
            'isGuest' => $isGuest,
            'isFollowing' => $authUser && ! $isOwner ? $authUser->isFollowing($user) : false,
            'followers' => $followers,
            'followingUsers' => $followingUsers,
        ]);
    }

    /**
     * Follow a user.
     */
    public function follow(User $user): RedirectResponse
    {
        $this->userService->follow(Auth::user(), $user);

        return back();
    }

    /**
     * Unfollow a user.
     */
    public function unfollow(User $user): RedirectResponse
    {
        $this->userService->unfollow(Auth::user(), $user);

        return back();
    }

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $activeSubscription = Subscription::where('user_id', $request->user()->id)
            ->whereIn('status', ['active', 'trialing'])
            ->with('plan')
            ->first();

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'activeSubscription' => $activeSubscription,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Update the user's cover photo.
     */
    public function updateCoverPhoto(Request $request): RedirectResponse
    {
        $request->validate(['cover_photo' => 'required|image|max:5120']);

        $user = $request->user();
        $path = $request->file('cover_photo')->store("users/{$user->id}/covers", 'public');
        $user->update(['cover_photo' => '/storage/'.$path]);

        return back()->with('success', 'Cover photo updated.');
    }

    /**
     * Update the user's avatar.
     */
    public function updateAvatar(Request $request): RedirectResponse
    {
        $request->validate(['avatar' => 'required|image|max:2048']);

        $user = $request->user();
        $path = $request->file('avatar')->store("users/{$user->id}/avatars", 'public');

        $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            ['avatar' => '/storage/'.$path],
        );

        return back()->with('success', 'Profile photo updated.');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
