<?php

namespace App\Http\Controllers;

use App\Enums\ClubRole;
use App\Enums\ClubType;
use App\Enums\RsvpStatus;
use App\Exceptions\ClubTierLimitException;
use App\Http\Requests\StoreClubEventRequest;
use App\Http\Requests\StoreClubPostRequest;
use App\Http\Requests\StoreClubRequest;
use App\Http\Requests\StoreClubSubscriptionRequest;
use App\Http\Requests\UpdateClubRequest;
use App\Models\Club\Club;
use App\Models\Club\ClubEvent;
use App\Models\Club\ClubEventAttendance;
use App\Models\Club\ClubJoinRequest;
use App\Models\Club\ClubPhoto;
use App\Models\Club\ClubPost;
use App\Models\User;
use App\Models\Vehicle;
use App\Services\ClubService;
use App\Services\ClubSubscriptionService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ClubController extends Controller
{
    public function __construct(
        private ClubService $clubService,
        private ClubSubscriptionService $subscriptionService,
    ) {}

    // ── Slug Check ──

    public function checkSlug(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'slug' => 'required|string|max:100',
            'exclude' => 'nullable|string',
        ]);

        $query = Club::where('slug', $request->slug);

        if ($request->exclude) {
            $query->where('slug', '!=', $request->exclude);
        }

        return response()->json([
            'available' => ! $query->exists(),
        ]);
    }

    // ── Club CRUD ──

    public function index(Request $request): Response
    {
        $user = Auth::user();

        $myClubs = $user->clubs()
            ->withCount('members')
            ->latest('club_members.updated_at')
            ->get();

        $followedClubs = $user->followedClubs()
            ->withCount('members')
            ->get();

        $discoverClubs = Club::where('is_active', true)
            ->where('is_archived', false)
            ->where('type', '!=', ClubType::SECRET)
            ->whereDoesntHave('clubMembers', fn ($q) => $q->where('user_id', $user->id))
            ->withCount('members')
            ->latest()
            ->limit(20)
            ->get();

        return Inertia::render('Clubs/Index', [
            'myClubs' => $myClubs,
            'followedClubs' => $followedClubs,
            'discoverClubs' => $discoverClubs,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Clubs/Create');
    }

    public function store(StoreClubRequest $request): RedirectResponse
    {
        $club = $this->clubService->create(Auth::user(), $request->validated());

        return redirect()->route('clubs.show', $club)->with('success', 'Club created successfully.');
    }

    public function show(Club $club): Response
    {
        // Secret clubs require membership — redirect guests to login
        if ($club->type === ClubType::SECRET) {
            if (! Auth::check()) {
                abort(404);
            }
            $this->authorize('view', $club);
        }

        $user = Auth::user();
        $membership = $user ? $club->clubMembers()->where('user_id', $user->id)->first() : null;
        $isFollowing = $user ? $club->followers()->where('user_id', $user->id)->exists() : false;

        $club->load(['owner']);
        $club->loadCount(['members', 'followers', 'posts', 'events', 'photos']);

        $posts = $club->posts()
            ->with('user')
            ->when(! $membership, fn ($q) => $q->where('visibility', 'public'))
            ->latest()
            ->paginate(15);

        $upcomingEvents = $club->events()
            ->with('creator')
            ->where('starts_at', '>=', now())
            ->where('is_cancelled', false)
            ->orderBy('starts_at')
            ->limit(5)
            ->get();

        $recentMembers = $club->clubMembers()
            ->with('user')
            ->orderByRaw("FIELD(role, 'president', 'vice_president', 'secretary', 'treasurer', 'road_captain', 'moderator', 'member')")
            ->limit(8)
            ->get();

        $photos = $club->photos()
            ->with('user')
            ->latest()
            ->limit(9)
            ->get();

        // ── Moto-specific data ──

        $memberIds = $club->members()->pluck('users.id');

        $garageVehicles = Vehicle::whereIn('user_id', $memberIds)
            ->active()
            ->with(['vehicleType', 'category', 'bikeDetails', 'primaryPhoto', 'user:id,name,username'])
            ->latest()
            ->get();

        $garageStats = [
            'totalVehicles' => $garageVehicles->count(),
            'totalCC' => $garageVehicles->sum(fn ($v) => $v->bikeDetails?->cc ?? 0),
            'avgCC' => (int) round($garageVehicles->avg(fn ($v) => $v->bikeDetails?->cc) ?? 0),
            'topCategory' => $garageVehicles->groupBy(fn ($v) => $v->category?->name)
                ->filter(fn ($group, $key) => $key !== '')
                ->sortByDesc->count()
                ->keys()
                ->first(),
            'categoryBreakdown' => $garageVehicles->groupBy(fn ($v) => $v->category?->name ?? 'Other')
                ->map->count()
                ->sortByDesc(fn ($c) => $c)
                ->toArray(),
        ];

        $memberPoints = $club->clubMembers()
            ->where('points', '>', 0)
            ->with('user:id,name,username,avatar')
            ->orderByDesc('points')
            ->limit(5)
            ->get()
            ->map(fn ($m) => [
                'id' => $m->user->id,
                'name' => $m->user->display_name,
                'avatar' => $m->user->avatar,
                'points' => $m->points,
            ]);

        $pendingRequest = $user && ! $membership
            ? $club->joinRequests()->where('user_id', $user->id)->where('status', 'pending')->exists()
            : false;

        return Inertia::render('Clubs/Show', [
            'club' => $club,
            'membership' => $membership,
            'isFollowing' => $isFollowing,
            'isGuest' => ! $user,
            'pendingRequest' => $pendingRequest,
            'posts' => $posts,
            'upcomingEvents' => $upcomingEvents,
            'recentMembers' => $recentMembers,
            'photos' => $photos,
            'garageVehicles' => $garageVehicles,
            'garageStats' => $garageStats,
            'memberPoints' => $memberPoints,
        ]);
    }

    public function edit(Club $club): Response
    {
        $this->authorize('update', $club);

        return Inertia::render('Clubs/Edit', [
            'club' => $club,
        ]);
    }

    public function update(UpdateClubRequest $request, Club $club): RedirectResponse
    {
        $this->authorize('update', $club);

        try {
            $this->clubService->update($club, $request->validated());
        } catch (ClubTierLimitException $e) {
            return back()->withErrors(['tier' => $e->getMessage()]);
        }

        return redirect()->route('clubs.show', $club)->with('success', 'Club updated successfully.');
    }

    public function destroy(Club $club): RedirectResponse
    {
        $this->authorize('delete', $club);

        $this->clubService->delete($club);

        return redirect()->route('clubs.index')->with('success', 'Club deleted.');
    }

    // ── Membership ──

    public function join(Club $club): RedirectResponse
    {
        $this->authorize('join', $club);

        if ($club->type === ClubType::PRIVATE || $club->requires_approval) {
            $this->clubService->createJoinRequest($club, Auth::user());

            return back()->with('success', 'Join request sent.');
        }

        try {
            $this->clubService->join(Auth::user(), $club);
        } catch (ClubTierLimitException $e) {
            return back()->withErrors(['tier' => $e->getMessage()]);
        }

        return back()->with('success', 'You joined the club!');
    }

    public function leave(Club $club): RedirectResponse
    {
        $this->clubService->leave(Auth::user(), $club);

        return back()->with('success', 'You left the club.');
    }

    // ── Following ──

    public function follow(Club $club): RedirectResponse
    {
        $this->clubService->follow(Auth::user(), $club);

        return back()->with('success', 'Following club.');
    }

    public function unfollow(Club $club): RedirectResponse
    {
        $this->clubService->unfollow(Auth::user(), $club);

        return back()->with('success', 'Unfollowed club.');
    }

    // ── Members ──

    public function members(Club $club): Response
    {
        $this->authorize('view', $club);

        $members = $club->clubMembers()
            ->with('user')
            ->orderByRaw("FIELD(role, 'president', 'vice_president', 'secretary', 'treasurer', 'road_captain', 'moderator', 'member')")
            ->paginate(30);

        $membership = $club->clubMembers()->where('user_id', Auth::id())->first();

        return Inertia::render('Clubs/Members', [
            'club' => $club,
            'members' => $members,
            'membership' => $membership,
            'ownerId' => $club->owner_id,
        ]);
    }

    public function updateMemberRole(Request $request, Club $club, User $member): RedirectResponse
    {
        $this->authorize('manageRoles', $club);

        $request->validate(['role' => ['required', Rule::enum(ClubRole::class)]]);

        try {
            $this->clubService->updateMemberRole($club, $member, ClubRole::from($request->role), Auth::user());
        } catch (ClubTierLimitException $e) {
            return back()->withErrors(['tier' => $e->getMessage()]);
        } catch (AuthorizationException $e) {
            return back()->withErrors(['role' => $e->getMessage()]);
        }

        return back()->with('success', 'Role updated.');
    }

    public function removeMember(Club $club, User $member): RedirectResponse
    {
        $this->authorize('manageMembers', $club);

        $this->clubService->removeMember($club, $member);

        return back()->with('success', 'Member removed.');
    }

    public function blockMember(Request $request, Club $club, User $member): RedirectResponse
    {
        $this->authorize('manageMembers', $club);

        $this->clubService->blockUser($club, $member, Auth::user(), $request->input('reason'));

        return back()->with('success', 'User blocked.');
    }

    public function unblockMember(Club $club, User $member): RedirectResponse
    {
        $this->authorize('manageMembers', $club);

        $this->clubService->unblockUser($club, $member);

        return back()->with('success', 'User unblocked.');
    }

    public function muteMember(Club $club, User $member): RedirectResponse
    {
        $this->authorize('manageMembers', $club);

        $this->clubService->muteMember($club, $member);

        return back()->with('success', 'Member muted.');
    }

    public function unmuteMember(Club $club, User $member): RedirectResponse
    {
        $this->authorize('manageMembers', $club);

        $this->clubService->unmuteMember($club, $member);

        return back()->with('success', 'Member unmuted.');
    }

    // ── Posts ──

    public function storePost(StoreClubPostRequest $request, Club $club): RedirectResponse
    {
        try {
            $this->clubService->createPost($club, Auth::user(), $request->validated());
        } catch (ClubTierLimitException $e) {
            return back()->withErrors(['tier' => $e->getMessage()]);
        }

        return back()->with('success', 'Post created.');
    }

    public function destroyPost(Club $club, ClubPost $post): RedirectResponse
    {
        $this->authorize('managePosts', $club);

        $this->clubService->deletePost($post);

        return back()->with('success', 'Post deleted.');
    }

    public function pinPost(Club $club, ClubPost $post): RedirectResponse
    {
        $this->authorize('managePosts', $club);

        try {
            $this->clubService->pinPost($club, $post);
        } catch (ClubTierLimitException $e) {
            return back()->withErrors(['tier' => $e->getMessage()]);
        }

        return back()->with('success', 'Post pinned.');
    }

    public function unpinPost(Club $club, ClubPost $post): RedirectResponse
    {
        $this->authorize('managePosts', $club);

        $this->clubService->unpinPost($post);

        return back()->with('success', 'Post unpinned.');
    }

    // ── Events ──

    public function events(Club $club): Response
    {
        $this->authorize('view', $club);

        $events = $club->events()
            ->with('creator')
            ->withCount('rsvps')
            ->orderBy('starts_at', 'desc')
            ->paginate(15);

        $membership = $club->clubMembers()->where('user_id', Auth::id())->first();

        return Inertia::render('Clubs/Events', [
            'club' => $club,
            'events' => $events,
            'membership' => $membership,
        ]);
    }

    public function createEvent(Club $club): Response
    {
        $this->authorize('manageEvents', $club);

        return Inertia::render('Clubs/Events/Create', [
            'club' => $club,
        ]);
    }

    public function storeEvent(StoreClubEventRequest $request, Club $club): RedirectResponse
    {
        $this->authorize('manageEvents', $club);

        try {
            $this->clubService->createEvent($club, Auth::user(), $request->validated());
        } catch (ClubTierLimitException $e) {
            return back()->withErrors(['tier' => $e->getMessage()]);
        }

        return redirect()->route('clubs.events', $club)->with('success', 'Event created.');
    }

    public function showEvent(Club $club, ClubEvent $event): Response
    {
        $this->authorize('view', $club);

        $event->load(['creator', 'rsvps.user']);
        $userRsvp = $event->rsvps()->where('user_id', Auth::id())->first();

        $user = Auth::user();
        $membership = $user ? $club->clubMembers()->where('user_id', $user->id)->first() : null;
        $canManage = $membership && $membership->role->isOfficer();
        $isPastEvent = $event->starts_at->isPast();

        $attendance = $event->attendances()->pluck('user_id')->toArray();

        $clubMembers = $canManage && $isPastEvent
            ? $club->clubMembers()->with('user:id,name,username,avatar')->get()
            : [];

        return Inertia::render('Clubs/Events/Show', [
            'club' => $club,
            'event' => $event,
            'userRsvp' => $userRsvp,
            'attendance' => $attendance,
            'clubMembers' => $clubMembers,
            'canManage' => (bool) $canManage,
            'isPastEvent' => $isPastEvent,
        ]);
    }

    public function rsvpEvent(Request $request, Club $club, ClubEvent $event): RedirectResponse
    {
        $request->validate(['status' => 'required|in:going,maybe,not_going']);

        $this->clubService->rsvpEvent($event, Auth::user(), RsvpStatus::from($request->status));

        return back()->with('success', 'RSVP updated.');
    }

    public function markAttendance(Request $request, Club $club, ClubEvent $event): RedirectResponse
    {
        $this->authorize('manageEvents', $club);

        $request->validate([
            'user_ids' => 'present|array',
            'user_ids.*' => 'integer|exists:users,id',
        ]);

        $newUserIds = collect($request->input('user_ids'));
        $currentUserIds = $event->attendances()->pluck('user_id');

        $toAdd = $newUserIds->diff($currentUserIds);
        $toRemove = $currentUserIds->diff($newUserIds);

        foreach ($toAdd as $userId) {
            ClubEventAttendance::create([
                'club_event_id' => $event->id,
                'user_id' => $userId,
                'marked_by' => Auth::id(),
            ]);

            $club->clubMembers()->where('user_id', $userId)->increment('points', 10);
        }

        foreach ($toRemove as $userId) {
            $event->attendances()->where('user_id', $userId)->delete();

            $club->clubMembers()->where('user_id', $userId)->decrement('points', 10);
        }

        return back()->with('success', 'Attendance updated.');
    }

    // ── Chat ──

    public function chat(Club $club): Response
    {
        $this->authorize('accessChat', $club);

        $messages = $club->chatMessages()
            ->with('user')
            ->latest()
            ->paginate(50);

        return Inertia::render('Clubs/Chat', [
            'club' => $club,
            'messages' => $messages,
            'hasChatAccess' => $club->getTier()->hasChat(),
        ]);
    }

    public function sendMessage(Request $request, Club $club): RedirectResponse
    {
        $this->authorize('accessChat', $club);

        $request->validate(['message' => 'required|string|max:1000']);

        try {
            $this->clubService->sendMessage($club, Auth::user(), $request->only('message'));
        } catch (ClubTierLimitException $e) {
            return back()->withErrors(['tier' => $e->getMessage()]);
        }

        return back();
    }

    // ── Invites ──

    public function storeInvite(Request $request, Club $club): RedirectResponse
    {
        $this->authorize('manageMembers', $club);

        $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'email' => 'nullable|email',
        ]);

        $this->clubService->createInvite($club, Auth::user(), $request->only(['user_id', 'email']));

        return back()->with('success', 'Invite sent.');
    }

    // ── Join Requests ──

    public function requests(Club $club): Response
    {
        $this->authorize('manageMembers', $club);

        $requests = $club->joinRequests()
            ->with('user')
            ->where('status', 'pending')
            ->latest()
            ->paginate(20);

        return Inertia::render('Clubs/Requests', [
            'club' => $club,
            'requests' => $requests,
        ]);
    }

    public function approveRequest(Club $club, ClubJoinRequest $joinRequest): RedirectResponse
    {
        $this->authorize('manageMembers', $club);

        try {
            $this->clubService->approveJoinRequest($joinRequest, Auth::user());
        } catch (ClubTierLimitException $e) {
            return back()->withErrors(['tier' => $e->getMessage()]);
        }

        return back()->with('success', 'Request approved.');
    }

    public function rejectRequest(Club $club, ClubJoinRequest $joinRequest): RedirectResponse
    {
        $this->authorize('manageMembers', $club);

        $this->clubService->rejectJoinRequest($joinRequest, Auth::user());

        return back()->with('success', 'Request rejected.');
    }

    // ── Settings ──

    public function settings(Club $club): Response
    {
        $this->authorize('manageSettings', $club);

        $club->loadCount(['members', 'posts', 'events']);
        $club->load(['activeSubscription', 'latestSubscription']);

        return Inertia::render('Clubs/Settings', [
            'club' => $club,
            'tier' => $club->getTier(),
            'activeSubscription' => $club->activeSubscription,
            'latestSubscription' => $club->latestSubscription,
        ]);
    }

    // ── Subscription ──

    public function subscription(Club $club): Response
    {
        $this->authorize('manageSettings', $club);

        $settings = $this->subscriptionService->getSettings();
        $club->load(['activeSubscription.coupon', 'latestSubscription.coupon']);

        return Inertia::render('Clubs/Subscription', [
            'club' => $club,
            'settings' => $settings,
            'activeSubscription' => $club->activeSubscription,
            'latestSubscription' => $club->latestSubscription,
        ]);
    }

    public function storeSubscription(StoreClubSubscriptionRequest $request, Club $club): RedirectResponse
    {
        $this->authorize('manageSettings', $club);

        try {
            $this->subscriptionService->subscribe($club, Auth::user(), [
                'receipt' => $request->file('receipt'),
                'coupon_code' => $request->input('coupon_code'),
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['subscription' => $e->getMessage()]);
        }

        return back()->with('success', 'Subscription request submitted! We will review your payment receipt.');
    }

    public function validateCoupon(Request $request, Club $club): \Illuminate\Http\JsonResponse
    {
        $request->validate(['coupon_code' => 'required|string']);

        $settings = $this->subscriptionService->getSettings();

        if (! $settings) {
            return response()->json(['valid' => false, 'error' => 'Pricing not configured.']);
        }

        $result = $this->subscriptionService->validateCoupon(
            $request->input('coupon_code'),
            (float) $settings->yearly_price,
        );

        return response()->json([
            'valid' => $result['valid'],
            'discount' => $result['discount'] ?? 0,
            'final_amount' => $result['final_amount'] ?? null,
            'error' => $result['error'] ?? null,
        ]);
    }

    // ── Cover & Avatar ──

    public function updateCoverImage(Request $request, Club $club): RedirectResponse
    {
        $this->authorize('update', $club);

        $request->validate(['cover_image' => 'required|image|max:5120']);

        $path = $request->file('cover_image')->store("clubs/{$club->id}/covers", 'public');
        $club->update(['cover_image' => '/storage/'.$path]);

        return back()->with('success', 'Cover photo updated.');
    }

    public function updateAvatar(Request $request, Club $club): RedirectResponse
    {
        $this->authorize('update', $club);

        $request->validate(['avatar' => 'required|image|max:2048']);

        $path = $request->file('avatar')->store("clubs/{$club->id}/avatars", 'public');
        $club->update(['avatar' => '/storage/'.$path]);

        return back()->with('success', 'Club photo updated.');
    }

    // ── Photo Gallery ──

    public function storePhotos(Request $request, Club $club): RedirectResponse
    {
        $this->authorize('update', $club);

        $request->validate([
            'photos' => 'required|array|min:1|max:10',
            'photos.*' => 'image|max:5120',
        ]);

        foreach ($request->file('photos') as $file) {
            $path = $file->store("clubs/{$club->id}/photos", 'public');
            $club->photos()->create([
                'user_id' => Auth::id(),
                'path' => '/storage/'.$path,
            ]);
        }

        return back()->with('success', 'Photos uploaded.');
    }

    public function destroyPhoto(Club $club, ClubPhoto $photo): RedirectResponse
    {
        $this->authorize('update', $club);

        $photo->delete();

        return back()->with('success', 'Photo deleted.');
    }
}
