<?php

namespace App\Enums;

enum VehicleLayoutTemplate: string
{
    case CLASSIC = 'classic';
    case SHOWCASE = 'showcase';
    case SPEC_SHEET = 'spec_sheet';

    public function label(): string
    {
        return match ($this) {
            self::CLASSIC => 'Classic',
            self::SHOWCASE => 'Showcase',
            self::SPEC_SHEET => 'Spec Sheet',
        };
    }
}
