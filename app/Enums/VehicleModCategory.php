<?php

namespace App\Enums;

enum VehicleModCategory: string
{
    case ENGINE = 'engine';
    case SUSPENSION = 'suspension';
    case EXHAUST = 'exhaust';
    case BRAKES = 'brakes';
    case COSMETIC = 'cosmetic';
    case WHEELS = 'wheels';
    case ELECTRONICS = 'electronics';
    case OTHER = 'other';

    public function label(): string
    {
        return match ($this) {
            self::ENGINE => 'Engine',
            self::SUSPENSION => 'Suspension',
            self::EXHAUST => 'Exhaust',
            self::BRAKES => 'Brakes',
            self::COSMETIC => 'Cosmetic',
            self::WHEELS => 'Wheels & Tires',
            self::ELECTRONICS => 'Electronics',
            self::OTHER => 'Other',
        };
    }
}
