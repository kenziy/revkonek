<?php

namespace App\Enums;

enum ClubType: string
{
    case PUBLIC = 'public';
    case PRIVATE = 'private';
    case SECRET = 'secret';
}
