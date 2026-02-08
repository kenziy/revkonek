<?php

namespace App\Services;

use App\Enums\ClubEventType;
use App\Enums\ClubRole;
use App\Enums\ClubTier;
use App\Enums\InviteStatus;
use App\Enums\JoinRequestStatus;
use App\Enums\PostVisibility;
use App\Enums\RsvpStatus;
use App\Exceptions\ClubTierLimitException;
use App\Models\Club\Club;
use App\Models\Club\ClubBlockedUser;
use App\Models\Club\ClubChatMessage;
use App\Models\Club\ClubEvent;
use App\Models\Club\ClubEventRsvp;
use App\Models\Club\ClubInvite;
use App\Models\Club\ClubJoinRequest;
use App\Models\Club\ClubPost;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Str;

class ClubService
{
    // ── Club CRUD ──

    public function create(User $user, array $data): Club
    {
        $club = Club::create([
            'owner_id' => $user->id,
            'name' => $data['name'],
            'slug' => $data['slug'],
            'description' => $data['description'] ?? null,
            'avatar' => $data['avatar'] ?? null,
            'type' => $data['type'] ?? 'public',
            'requires_approval' => $data['requires_approval'] ?? false,
            'city' => $data['city'] ?? null,
            'province' => $data['province'] ?? null,
        ]);

        // Owner automatically becomes the president
        $club->clubMembers()->create([
            'user_id' => $user->id,
            'role' => ClubRole::PRESIDENT,
            'joined_at' => now(),
        ]);

        return $club;
    }

    public function update(Club $club, array $data): Club
    {
        $tier = $club->getTier();

        if (isset($data['cover_image']) && ! $tier->hasCoverImage()) {
            throw new ClubTierLimitException('cover image');
        }

        if (isset($data['theme_color']) && ! $tier->hasCustomTheme()) {
            throw new ClubTierLimitException('custom theme');
        }

        $club->update($data);

        return $club->fresh();
    }

    public function delete(Club $club): void
    {
        $club->delete();
    }

    // ── Membership ──

    public function join(User $user, Club $club): void
    {
        $tier = $club->getTier();

        if ($club->clubMembers()->count() >= $tier->maxMembers()) {
            throw new ClubTierLimitException('more members');
        }

        $club->clubMembers()->create([
            'user_id' => $user->id,
            'role' => ClubRole::MEMBER,
            'joined_at' => now(),
        ]);
    }

    public function leave(User $user, Club $club): void
    {
        $club->clubMembers()->where('user_id', $user->id)->delete();
    }

    public function updateMemberRole(Club $club, User $target, ClubRole $role, User $actor): void
    {
        $tier = $club->getTier();
        $isOwner = $club->owner_id === $actor->id;

        // Non-owners must have a role that canManageRoles and outrank the target role
        if (! $isOwner) {
            $actorMembership = $club->clubMembers()->where('user_id', $actor->id)->first();

            if (! $actorMembership || ! $actorMembership->role->canManageRoles()) {
                throw new AuthorizationException('You do not have permission to manage roles.');
            }

            // Cannot assign a role at or above your own rank
            if ($role->rank() <= $actorMembership->role->rank()) {
                throw new AuthorizationException('You cannot assign a role equal to or above your own.');
            }

            // Cannot change role of someone at or above your rank
            $targetMembership = $club->clubMembers()->where('user_id', $target->id)->first();
            if ($targetMembership && $targetMembership->role->rank() <= $actorMembership->role->rank()) {
                throw new AuthorizationException('You cannot change the role of someone at or above your rank.');
            }
        }

        // President uniqueness: auto-demote current president to VP
        if ($role === ClubRole::PRESIDENT) {
            $club->clubMembers()
                ->where('role', ClubRole::PRESIDENT)
                ->where('user_id', '!=', $target->id)
                ->update(['role' => ClubRole::VICE_PRESIDENT]);
        }

        // Tier limits
        if ($role === ClubRole::VICE_PRESIDENT) {
            $vpCount = $club->clubMembers()
                ->where('role', ClubRole::VICE_PRESIDENT)
                ->where('user_id', '!=', $target->id)
                ->count();
            if ($vpCount >= $tier->maxVicePresidents()) {
                throw new ClubTierLimitException('more vice presidents');
            }
        }

        if (in_array($role, [ClubRole::SECRETARY, ClubRole::TREASURER, ClubRole::ROAD_CAPTAIN, ClubRole::MODERATOR])) {
            $officerCount = $club->clubMembers()
                ->whereIn('role', [ClubRole::SECRETARY, ClubRole::TREASURER, ClubRole::ROAD_CAPTAIN, ClubRole::MODERATOR])
                ->where('user_id', '!=', $target->id)
                ->count();
            if ($officerCount >= $tier->maxOfficers()) {
                throw new ClubTierLimitException('more officers');
            }
        }

        $club->clubMembers()->where('user_id', $target->id)->update(['role' => $role]);
    }

    public function removeMember(Club $club, User $target): void
    {
        $club->clubMembers()->where('user_id', $target->id)->delete();
    }

    public function muteMember(Club $club, User $target, ?\DateTime $until = null): void
    {
        $club->clubMembers()->where('user_id', $target->id)->update([
            'is_muted' => true,
            'muted_until' => $until,
        ]);
    }

    public function unmuteMember(Club $club, User $target): void
    {
        $club->clubMembers()->where('user_id', $target->id)->update([
            'is_muted' => false,
            'muted_until' => null,
        ]);
    }

    // ── Blocking ──

    public function blockUser(Club $club, User $target, User $blockedBy, ?string $reason = null): void
    {
        ClubBlockedUser::create([
            'club_id' => $club->id,
            'user_id' => $target->id,
            'blocked_by' => $blockedBy->id,
            'reason' => $reason,
        ]);

        // Also remove from members if they are one
        $this->removeMember($club, $target);
    }

    public function unblockUser(Club $club, User $target): void
    {
        $club->blockedUsers()->where('user_id', $target->id)->delete();
    }

    // ── Following ──

    public function follow(User $user, Club $club): void
    {
        $club->followers()->syncWithoutDetaching([$user->id]);
    }

    public function unfollow(User $user, Club $club): void
    {
        $club->followers()->detach($user->id);
    }

    // ── Posts ──

    public function createPost(Club $club, User $user, array $data): ClubPost
    {
        $visibility = $data['visibility'] ?? PostVisibility::PUBLIC->value;

        if ($visibility === PostVisibility::MEMBERS_ONLY->value && ! $club->getTier()->hasMembersOnlyPosts()) {
            throw new ClubTierLimitException('members-only posts');
        }

        return $club->posts()->create([
            'user_id' => $user->id,
            'content' => $data['content'],
            'is_announcement' => $data['is_announcement'] ?? false,
            'visibility' => $visibility,
        ]);
    }

    public function updatePost(ClubPost $post, array $data): ClubPost
    {
        $post->update($data);

        return $post->fresh();
    }

    public function deletePost(ClubPost $post): void
    {
        $post->delete();
    }

    public function pinPost(Club $club, ClubPost $post): void
    {
        $tier = $club->getTier();
        $pinnedCount = $club->posts()->where('is_pinned', true)->count();

        if ($pinnedCount >= $tier->pinnedPosts()) {
            throw new ClubTierLimitException('more pinned posts');
        }

        $post->update(['is_pinned' => true]);
    }

    public function unpinPost(ClubPost $post): void
    {
        $post->update(['is_pinned' => false]);
    }

    // ── Events ──

    public function createEvent(Club $club, User $user, array $data): ClubEvent
    {
        $type = $data['type'] ?? ClubEventType::MEETUP->value;

        if ($type === ClubEventType::RIDE->value) {
            $ridesThisMonth = $club->events()
                ->where('type', ClubEventType::RIDE)
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count();

            if ($ridesThisMonth >= $club->getTier()->ridesPerMonth()) {
                throw new ClubTierLimitException('more rides this month');
            }
        }

        if (isset($data['max_attendees']) && ! $club->getTier()->hasEventManagement()) {
            throw new ClubTierLimitException('event management (RSVP limits)');
        }

        return $club->events()->create([
            'created_by' => $user->id,
            'type' => $type,
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'location_name' => $data['location_name'] ?? null,
            'latitude' => $data['latitude'] ?? null,
            'longitude' => $data['longitude'] ?? null,
            'starts_at' => $data['starts_at'],
            'ends_at' => $data['ends_at'] ?? null,
            'max_attendees' => $data['max_attendees'] ?? null,
            'route_link' => $data['route_link'] ?? null,
        ]);
    }

    public function updateEvent(ClubEvent $event, array $data): ClubEvent
    {
        $event->update($data);

        return $event->fresh();
    }

    public function deleteEvent(ClubEvent $event): void
    {
        $event->delete();
    }

    public function rsvpEvent(ClubEvent $event, User $user, RsvpStatus $status): ClubEventRsvp
    {
        return ClubEventRsvp::updateOrCreate(
            ['club_event_id' => $event->id, 'user_id' => $user->id],
            ['status' => $status],
        );
    }

    // ── Chat ──

    public function sendMessage(Club $club, User $user, array $data): ClubChatMessage
    {
        if (! $club->getTier()->hasChat()) {
            throw new ClubTierLimitException('chat');
        }

        return $club->chatMessages()->create([
            'user_id' => $user->id,
            'message' => $data['message'],
            'attachment' => $data['attachment'] ?? null,
        ]);
    }

    // ── Invites ──

    public function createInvite(Club $club, User $invitedBy, array $data): ClubInvite
    {
        return $club->invites()->create([
            'invited_by' => $invitedBy->id,
            'user_id' => $data['user_id'] ?? null,
            'email' => $data['email'] ?? null,
            'token' => Str::random(32),
            'status' => InviteStatus::PENDING,
            'expires_at' => now()->addDays(7),
        ]);
    }

    public function deleteInvite(ClubInvite $invite): void
    {
        $invite->delete();
    }

    // ── Join Requests ──

    public function createJoinRequest(Club $club, User $user, ?string $message = null): ClubJoinRequest
    {
        return $club->joinRequests()->create([
            'user_id' => $user->id,
            'message' => $message,
            'status' => JoinRequestStatus::PENDING,
        ]);
    }

    public function approveJoinRequest(ClubJoinRequest $request, User $reviewer): void
    {
        $request->update([
            'status' => JoinRequestStatus::APPROVED,
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => now(),
        ]);

        $this->join($request->user, $request->club);
    }

    public function rejectJoinRequest(ClubJoinRequest $request, User $reviewer): void
    {
        $request->update([
            'status' => JoinRequestStatus::REJECTED,
            'reviewed_by' => $reviewer->id,
            'reviewed_at' => now(),
        ]);
    }
}
