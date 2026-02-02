<?php

namespace App\Enums;

enum CarCategory: string
{
    case SEDAN = 'sedan';
    case COUPE = 'coupe';
    case HATCHBACK = 'hatchback';
    case SUV = 'suv';
    case TRUCK = 'truck';
    case SPORTS = 'sports';
    case MUSCLE = 'muscle';
    case LUXURY = 'luxury';
    case ELECTRIC = 'electric';
    case WAGON = 'wagon';
    case CONVERTIBLE = 'convertible';
    case VAN = 'van';
    case OTHER = 'other';

    public function label(): string
    {
        return match ($this) {
            self::SEDAN => 'Sedan',
            self::COUPE => 'Coupe',
            self::HATCHBACK => 'Hatchback',
            self::SUV => 'SUV',
            self::TRUCK => 'Truck',
            self::SPORTS => 'Sports',
            self::MUSCLE => 'Muscle',
            self::LUXURY => 'Luxury',
            self::ELECTRIC => 'Electric',
            self::WAGON => 'Wagon',
            self::CONVERTIBLE => 'Convertible',
            self::VAN => 'Van',
            self::OTHER => 'Other',
        };
    }
}
