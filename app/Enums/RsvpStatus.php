<?php

namespace App\Enums;

enum RsvpStatus: string
{
    case GOING = 'going';
    case MAYBE = 'maybe';
    case NOT_GOING = 'not_going';
}
