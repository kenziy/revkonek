<?php

namespace App\Enums;

enum BikeCategory: string
{
    case SPORT = 'sport';
    case NAKED = 'naked';
    case CRUISER = 'cruiser';
    case TOURING = 'touring';
    case ADVENTURE = 'adventure';
    case SCOOTER = 'scooter';
    case UNDERBONE = 'underbone';
    case DUAL_SPORT = 'dual_sport';
    case SUPERMOTO = 'supermoto';
    case CAFE_RACER = 'cafe_racer';
    case BOBBER = 'bobber';
    case SCRAMBLER = 'scrambler';
    case OTHER = 'other';
}
