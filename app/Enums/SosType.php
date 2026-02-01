<?php

namespace App\Enums;

enum SosType: string
{
    case ACCIDENT = 'accident';
    case BREAKDOWN = 'breakdown';
    case MEDICAL = 'medical';
    case THEFT = 'theft';
    case OTHER = 'other';

    public function isCritical(): bool
    {
        return in_array($this, [self::ACCIDENT, self::MEDICAL]);
    }

    public function isUrgent(): bool
    {
        return $this === self::THEFT;
    }
}
