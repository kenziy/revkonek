<?php

namespace App\Models;

use App\Enums\SubscriptionTier;
use App\Models\Profile\UserProfile;
use App\Models\Profile\UserPrivacySetting;
use App\Models\Profile\Bike;
use App\Models\Auth\SocialAccount;
use App\Models\Auth\TwoFactorCode;
use App\Models\Auth\RecoveryCode;
use App\Models\Challenge\Challenge;
use App\Models\Challenge\UserChallengeStats;
use App\Models\Group\Group;
use App\Models\Group\GroupMember;
use App\Models\Shop\Shop;
use App\Models\Sos\EmergencyContact;
use App\Models\Sos\MedicalProfile;
use App\Models\Sos\TrustedResponder;
use App\Models\Subscription\Subscription;
use App\Models\Match\MatchPreference;
use App\Models\Match\AvailabilitySchedule;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, HasRoles, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'username',
        'phone',
        'date_of_birth',
        'is_active',
        'last_login_at',
        'two_factor_enabled',
        'two_factor_secret',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'date_of_birth' => 'date',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
            'two_factor_enabled' => 'boolean',
        ];
    }

    // Profile Relations
    public function profile(): HasOne
    {
        return $this->hasOne(UserProfile::class);
    }

    public function privacySettings(): HasOne
    {
        return $this->hasOne(UserPrivacySetting::class);
    }

    // Garage/Bikes
    public function bikes(): HasMany
    {
        return $this->hasMany(Bike::class);
    }

    public function activeBike(): HasOne
    {
        return $this->hasOne(Bike::class)->where('is_active', true);
    }

    // Auth Relations
    public function socialAccounts(): HasMany
    {
        return $this->hasMany(SocialAccount::class);
    }

    public function recoveryCodes(): HasMany
    {
        return $this->hasMany(RecoveryCode::class);
    }

    // Challenges
    public function sentChallenges(): HasMany
    {
        return $this->hasMany(Challenge::class, 'challenger_id');
    }

    public function receivedChallenges(): HasMany
    {
        return $this->hasMany(Challenge::class, 'challenged_id');
    }

    public function challengeStats(): HasOne
    {
        return $this->hasOne(UserChallengeStats::class);
    }

    // Groups
    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(Group::class, 'group_members')
            ->withPivot(['role', 'joined_at', 'is_muted', 'muted_until'])
            ->withTimestamps();
    }

    public function ownedGroups(): HasMany
    {
        return $this->hasMany(Group::class, 'owner_id');
    }

    // Shop
    public function shop(): HasOne
    {
        return $this->hasOne(Shop::class, 'owner_id');
    }

    // SOS/Emergency
    public function emergencyContacts(): HasMany
    {
        return $this->hasMany(EmergencyContact::class);
    }

    public function medicalProfile(): HasOne
    {
        return $this->hasOne(MedicalProfile::class);
    }

    public function trustedResponders(): HasMany
    {
        return $this->hasMany(TrustedResponder::class);
    }

    // Subscription
    public function subscription(): HasOne
    {
        return $this->hasOne(Subscription::class)->latest();
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    // Matchmaking
    public function matchPreference(): HasOne
    {
        return $this->hasOne(MatchPreference::class);
    }

    public function availabilitySchedule(): HasOne
    {
        return $this->hasOne(AvailabilitySchedule::class);
    }

    // Connections
    public function connections(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_connections', 'user_id', 'connected_user_id')
            ->withPivot(['status', 'connected_at'])
            ->withTimestamps();
    }

    public function blockedUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_blocks', 'user_id', 'blocked_user_id')
            ->withTimestamps();
    }

    // Helper Methods
    public function getSubscriptionTier(): SubscriptionTier
    {
        $subscription = $this->subscription;

        if ($subscription && $subscription->isActive()) {
            return SubscriptionTier::PREMIUM;
        }

        return SubscriptionTier::FREE;
    }

    public function isPremium(): bool
    {
        return $this->getSubscriptionTier() === SubscriptionTier::PREMIUM;
    }

    public function isAdult(): bool
    {
        return $this->date_of_birth && $this->date_of_birth->age >= 18;
    }

    public function hasBlocked(User $user): bool
    {
        return $this->blockedUsers()->where('blocked_user_id', $user->id)->exists();
    }

    public function isConnectedWith(User $user): bool
    {
        return $this->connections()
            ->where('connected_user_id', $user->id)
            ->wherePivot('status', 'accepted')
            ->exists();
    }
}
