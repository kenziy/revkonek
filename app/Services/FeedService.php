<?php

namespace App\Services;

use App\Enums\ClubType;
use App\Enums\PostVisibility;
use App\Models\Club\Club;
use App\Models\Club\ClubEvent;
use App\Models\Club\ClubPost;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Support\Facades\Storage;

class FeedService
{
    public function getFeed(User $user, int $offset = 0, int $limit = 15): array
    {
        $memberClubIds = $user->clubs()->pluck('clubs.id')->toArray();
        $followedClubIds = $user->followedClubs()
            ->whereNotIn('clubs.id', $memberClubIds)
            ->pluck('clubs.id')
            ->toArray();

        $items = collect();

        // 1. Member club posts (public + members_only)
        if (! empty($memberClubIds)) {
            $memberPosts = ClubPost::whereIn('club_id', $memberClubIds)
                ->with([
                    'club:id,name,slug,avatar,is_verified,is_premium',
                    'user:id,name,username',
                    'user.profile:id,user_id,avatar',
                ])
                ->latest()
                ->limit(30)
                ->get()
                ->map(fn ($post) => $this->formatPostItem($post, 'member'));

            $items = $items->merge($memberPosts);
        }

        // 2. Followed club posts (public only)
        if (! empty($followedClubIds)) {
            $followedPosts = ClubPost::whereIn('club_id', $followedClubIds)
                ->where('visibility', PostVisibility::PUBLIC)
                ->with([
                    'club:id,name,slug,avatar,is_verified,is_premium',
                    'user:id,name,username',
                    'user.profile:id,user_id,avatar',
                ])
                ->latest()
                ->limit(20)
                ->get()
                ->map(fn ($post) => $this->formatPostItem($post, 'followed'));

            $items = $items->merge($followedPosts);
        }

        // 3. Discovery posts from active public/private clubs the user isn't a member of
        $excludeClubIds = array_merge($memberClubIds, $followedClubIds);
        $discoveryPosts = ClubPost::whereHas('club', function ($q) use ($excludeClubIds) {
            $q->where('is_active', true)
                ->where('is_archived', false)
                ->whereIn('type', [ClubType::PUBLIC, ClubType::PRIVATE])
                ->when(! empty($excludeClubIds), fn ($q2) => $q2->whereNotIn('clubs.id', $excludeClubIds));
        })
            ->where('visibility', PostVisibility::PUBLIC)
            ->with([
                'club:id,name,slug,avatar,is_verified,is_premium',
                'user:id,name,username',
                'user.profile:id,user_id,avatar',
            ])
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn ($post) => $this->formatPostItem($post, 'discovery'));

        $items = $items->merge($discoveryPosts);

        // 4. Vehicle spotlights (not owned by user, with photos, ordered by likes)
        $vehicles = Vehicle::active()
            ->where('user_id', '!=', $user->id)
            ->whereHas('photos')
            ->with([
                'primaryPhoto',
                'user:id,uuid,name,username',
                'user.profile:id,user_id,avatar',
                'category:id,name',
                'bikeDetails',
            ])
            ->withCount('likedBy')
            ->orderByDesc('liked_by_count')
            ->limit(10)
            ->get()
            ->map(fn ($vehicle) => $this->formatVehicleItem($vehicle));

        $items = $items->merge($vehicles);

        // 5. Upcoming events from member clubs
        if (! empty($memberClubIds)) {
            $events = ClubEvent::whereIn('club_id', $memberClubIds)
                ->where('starts_at', '>', now())
                ->where('is_cancelled', false)
                ->with([
                    'club:id,name,slug,avatar',
                ])
                ->withCount('rsvps')
                ->orderBy('starts_at')
                ->limit(10)
                ->get()
                ->map(fn ($event) => $this->formatEventItem($event));

            $items = $items->merge($events);
        }

        // Score and sort all items
        $scored = $items->map(function ($item) {
            $item['score'] = $this->calculateScore($item);
            return $item;
        })
            ->sortByDesc('score')
            ->values();

        // Paginate
        $total = $scored->count();
        $paginated = $scored->slice($offset, $limit)->values()->toArray();

        return [
            'items' => $paginated,
            'has_more' => ($offset + $limit) < $total,
            'next_offset' => $offset + $limit,
        ];
    }

    public function getSidebarEvents(User $user, int $limit = 3): array
    {
        $memberClubIds = $user->clubs()->pluck('clubs.id')->toArray();

        if (empty($memberClubIds)) {
            return [];
        }

        return ClubEvent::whereIn('club_id', $memberClubIds)
            ->where('starts_at', '>', now())
            ->where('is_cancelled', false)
            ->with('club:id,name,slug')
            ->orderBy('starts_at')
            ->limit($limit)
            ->get()
            ->map(fn ($event) => [
                'id' => $event->id,
                'title' => $event->title,
                'type' => $event->type->value,
                'starts_at' => $event->starts_at->toISOString(),
                'club_name' => $event->club->name,
                'club_slug' => $event->club->slug,
            ])
            ->toArray();
    }

    public function getUserClubs(User $user, int $limit = 5): array
    {
        return $user->clubs()
            ->withCount('members')
            ->limit($limit)
            ->get()
            ->map(fn ($club) => [
                'id' => $club->id,
                'name' => $club->name,
                'slug' => $club->slug,
                'avatar' => $club->avatar ? Storage::url($club->avatar) : null,
                'members_count' => $club->members_count,
            ])
            ->toArray();
    }

    private function formatPostItem(ClubPost $post, string $source): array
    {
        $avatarPath = $post->user?->profile?->avatar;

        return [
            'type' => 'club_post',
            'source' => $source,
            'id' => "post_{$post->id}",
            'data' => [
                'id' => $post->id,
                'content' => $post->content,
                'is_announcement' => $post->is_announcement,
                'is_pinned' => $post->is_pinned,
                'visibility' => $post->visibility->value,
                'club' => [
                    'id' => $post->club->id,
                    'name' => $post->club->name,
                    'slug' => $post->club->slug,
                    'avatar' => $post->club->avatar ? Storage::url($post->club->avatar) : null,
                    'is_verified' => $post->club->is_verified,
                    'is_premium' => $post->club->is_premium,
                ],
                'user' => [
                    'id' => $post->user->id,
                    'name' => $post->user->name,
                    'display_name' => $post->user->display_name,
                    'avatar' => $avatarPath ? Storage::url($avatarPath) : null,
                ],
                'created_at' => $post->created_at->toISOString(),
            ],
            'created_at' => $post->created_at->toISOString(),
            'is_pinned' => $post->is_pinned,
            'is_announcement' => $post->is_announcement,
            'likes_count' => 0,
        ];
    }

    private function formatVehicleItem(Vehicle $vehicle): array
    {
        $photo = $vehicle->primaryPhoto
            ? Storage::url($vehicle->primaryPhoto->path)
            : null;

        $avatarPath = $vehicle->user?->profile?->avatar;

        return [
            'type' => 'vehicle_spotlight',
            'source' => 'community',
            'id' => "vehicle_{$vehicle->id}",
            'data' => [
                'id' => $vehicle->id,
                'uuid' => $vehicle->uuid,
                'display_name' => $vehicle->display_name,
                'make' => $vehicle->make,
                'model' => $vehicle->model,
                'year' => $vehicle->year,
                'engine_spec' => $vehicle->engine_spec,
                'category' => $vehicle->category?->name,
                'photo' => $photo,
                'likes_count' => $vehicle->liked_by_count ?? 0,
                'owner' => [
                    'id' => $vehicle->user->id,
                    'uuid' => $vehicle->user->uuid,
                    'name' => $vehicle->user->name,
                    'display_name' => $vehicle->user->display_name,
                    'avatar' => $avatarPath ? Storage::url($avatarPath) : null,
                ],
            ],
            'created_at' => $vehicle->created_at->toISOString(),
            'is_pinned' => false,
            'is_announcement' => false,
            'likes_count' => $vehicle->liked_by_count ?? 0,
        ];
    }

    private function formatEventItem(ClubEvent $event): array
    {
        return [
            'type' => 'event',
            'source' => 'member',
            'id' => "event_{$event->id}",
            'data' => [
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'type' => $event->type->value,
                'location_name' => $event->location_name,
                'starts_at' => $event->starts_at->toISOString(),
                'ends_at' => $event->ends_at?->toISOString(),
                'rsvps_count' => $event->rsvps_count ?? 0,
                'club' => [
                    'id' => $event->club->id,
                    'name' => $event->club->name,
                    'slug' => $event->club->slug,
                    'avatar' => $event->club->avatar ? Storage::url($event->club->avatar) : null,
                ],
            ],
            'created_at' => $event->starts_at->toISOString(),
            'is_pinned' => false,
            'is_announcement' => false,
            'likes_count' => 0,
        ];
    }

    private function calculateScore(array $item): float
    {
        $createdAt = $item['created_at'];
        $hoursAgo = now()->diffInMinutes($createdAt) / 60;

        // Recency: halves every 24h
        $recency = 100 * pow(0.5, $hoursAgo / 24);

        // Source bonus
        $sourceBonus = match ($item['source']) {
            'member' => 30,
            'followed' => 15,
            'community' => 5,
            'discovery' => 0,
            default => 0,
        };

        // Type bonus
        $typeBonus = match ($item['type']) {
            'event' => 20,
            'vehicle_spotlight' => 5,
            'club_post' => 0,
            default => 0,
        };

        // Post-specific bonuses
        $pinBonus = ($item['is_pinned'] ?? false) ? 25 : 0;
        $announcementBonus = ($item['is_announcement'] ?? false) ? 15 : 0;

        // Vehicle likes bonus
        $likesBonus = min(($item['likes_count'] ?? 0) * 2, 20);

        return $recency + $sourceBonus + $typeBonus + $pinBonus + $announcementBonus + $likesBonus;
    }
}
