<?php

namespace App\Enums;

enum ClubSubscriptionStatus: string
{
    case PENDING_VERIFICATION = 'pending_verification';
    case ACTIVE = 'active';
    case EXPIRED = 'expired';
    case REJECTED = 'rejected';
    case CANCELLED = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::PENDING_VERIFICATION => 'Pending Verification',
            self::ACTIVE => 'Active',
            self::EXPIRED => 'Expired',
            self::REJECTED => 'Rejected',
            self::CANCELLED => 'Cancelled',
        };
    }

    public function badgeVariant(): string
    {
        return match ($this) {
            self::PENDING_VERIFICATION => 'warning',
            self::ACTIVE => 'success',
            self::EXPIRED => 'secondary',
            self::REJECTED => 'danger',
            self::CANCELLED => 'secondary',
        };
    }
}
