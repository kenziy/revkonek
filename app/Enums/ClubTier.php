<?php

namespace App\Enums;

enum ClubTier: string
{
    case FREE = 'free';
    case PRO = 'pro';

    public function maxMembers(): int
    {
        return match ($this) {
            self::FREE => 50,
            self::PRO => PHP_INT_MAX,
        };
    }

    public function maxVicePresidents(): int
    {
        return match ($this) {
            self::FREE => 1,
            self::PRO => PHP_INT_MAX,
        };
    }

    public function maxOfficers(): int
    {
        return match ($this) {
            self::FREE => 3,
            self::PRO => PHP_INT_MAX,
        };
    }

    public function ridesPerMonth(): int
    {
        return match ($this) {
            self::FREE => 5,
            self::PRO => PHP_INT_MAX,
        };
    }

    public function pinnedPosts(): int
    {
        return match ($this) {
            self::FREE => 1,
            self::PRO => PHP_INT_MAX,
        };
    }

    public function hasChat(): bool
    {
        return $this === self::PRO;
    }

    public function hasCoverImage(): bool
    {
        return $this === self::PRO;
    }

    public function hasCustomTheme(): bool
    {
        return $this === self::PRO;
    }

    public function hasAnalytics(): bool
    {
        return $this === self::PRO;
    }

    public function hasDiscoverPriority(): bool
    {
        return $this === self::PRO;
    }

    public function hasVerifiedBadge(): bool
    {
        return $this === self::PRO;
    }

    public function hasMembersOnlyPosts(): bool
    {
        return $this === self::PRO;
    }

    public function hasEventManagement(): bool
    {
        return $this === self::PRO;
    }
}
