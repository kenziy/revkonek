<?php

namespace App\Models\Club;

use App\Enums\ClubTier;
use App\Enums\ClubType;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Club extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_id',
        'name',
        'slug',
        'description',
        'avatar',
        'cover_image',
        'type',
        'city',
        'province',
        'is_premium',
        'requires_approval',
        'is_active',
        'is_archived',
        'theme_color',
        'is_verified',
        'last_activity_at',
        'archived_at',
    ];

    protected function casts(): array
    {
        return [
            'type' => ClubType::class,
            'requires_approval' => 'boolean',
            'is_premium' => 'boolean',
            'is_active' => 'boolean',
            'is_archived' => 'boolean',
            'is_verified' => 'boolean',
            'last_activity_at' => 'datetime',
            'archived_at' => 'datetime',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'club_members')
            ->withPivot(['role', 'joined_at', 'is_muted', 'muted_until'])
            ->withTimestamps();
    }

    public function clubMembers(): HasMany
    {
        return $this->hasMany(ClubMember::class);
    }

    public function posts(): HasMany
    {
        return $this->hasMany(ClubPost::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(ClubEvent::class);
    }

    public function chatMessages(): HasMany
    {
        return $this->hasMany(ClubChatMessage::class);
    }

    public function invites(): HasMany
    {
        return $this->hasMany(ClubInvite::class);
    }

    public function joinRequests(): HasMany
    {
        return $this->hasMany(ClubJoinRequest::class);
    }

    public function blockedUsers(): HasMany
    {
        return $this->hasMany(ClubBlockedUser::class);
    }

    public function followers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'club_followers')
            ->withTimestamps();
    }

    public function photos(): HasMany
    {
        return $this->hasMany(ClubPhoto::class)->orderBy('sort_order');
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(ClubSubscription::class);
    }

    public function activeSubscription(): HasOne
    {
        return $this->hasOne(ClubSubscription::class)
            ->where('status', \App\Enums\ClubSubscriptionStatus::ACTIVE)
            ->where('ends_at', '>', now());
    }

    public function latestSubscription(): HasOne
    {
        return $this->hasOne(ClubSubscription::class)->latestOfMany();
    }

    public function getTier(): ClubTier
    {
        return $this->is_premium ? ClubTier::PRO : ClubTier::FREE;
    }

    public function isPro(): bool
    {
        return $this->getTier() === ClubTier::PRO;
    }
}
