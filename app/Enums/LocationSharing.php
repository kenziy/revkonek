<?php

namespace App\Enums;

enum LocationSharing: string
{
    case PRECISE = 'precise';
    case CITY_LEVEL = 'city_level';
    case HIDDEN = 'hidden';
}
