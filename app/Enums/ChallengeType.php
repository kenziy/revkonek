<?php

namespace App\Enums;

enum ChallengeType: string
{
    case TIME_TRIAL = 'time_trial';
    case MEET_AND_CRUISE = 'meet_and_cruise';
    case TRACK_DAY = 'track_day';
}
