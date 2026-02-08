<?php

namespace App\Enums;

enum ClubEventType: string
{
    case RIDE = 'ride';
    case MEETUP = 'meetup';
    case TRACK_DAY = 'track_day';
    case WORKSHOP = 'workshop';
}
