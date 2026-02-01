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

    public function maxGroups(): int
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
}
