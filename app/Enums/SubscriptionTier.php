<?php

namespace App\Enums;

enum SubscriptionTier: string
{
    case FREE = 'free';
    case PREMIUM = 'premium';

    public function maxBikes(): int
    {
        return match ($this) {
            self::FREE => 2,
            self::PREMIUM => PHP_INT_MAX,
        };
    }

    public function maxClubs(): int
    {
        return match ($this) {
            self::FREE => 3,
            self::PREMIUM => PHP_INT_MAX,
        };
    }

    public function dailyDiscoveryLimit(): int
    {
        return match ($this) {
            self::FREE => 10,
            self::PREMIUM => PHP_INT_MAX,
        };
    }

    public function dailyMessageLimit(): int
    {
        return match ($this) {
            self::FREE => 20,
            self::PREMIUM => PHP_INT_MAX,
        };
    }

    public function maxVehiclePhotos(): int
    {
        return match ($this) {
            self::FREE => 1,
            self::PREMIUM => 10,
        };
    }

    public function hasPhotoGallery(): bool
    {
        return $this === self::PREMIUM;
    }

    public function hasLayoutTemplates(): bool
    {
        return $this === self::PREMIUM;
    }

    public function hasColorTheme(): bool
    {
        return $this === self::PREMIUM;
    }

    public function hasModsList(): bool
    {
        return $this === self::PREMIUM;
    }

    public function hasVehicleStory(): bool
    {
        return $this === self::PREMIUM;
    }

    public function hasCoverBanner(): bool
    {
        return $this === self::PREMIUM;
    }

    public function hasSocialLinks(): bool
    {
        return $this === self::PREMIUM;
    }

    public function hasBackgroundMusic(): bool
    {
        return $this === self::PREMIUM;
    }

    public function hasProBadge(): bool
    {
        return $this === self::PREMIUM;
    }
}
