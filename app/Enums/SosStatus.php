<?php

namespace App\Enums;

enum SosStatus: string
{
    case ACTIVE = 'active';
    case RESPONDING = 'responding';
    case RESOLVED = 'resolved';
    case CANCELLED = 'cancelled';
    case FALSE_ALARM = 'false_alarm';
}
