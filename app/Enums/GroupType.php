<?php

namespace App\Enums;

enum GroupType: string
{
    case PUBLIC = 'public';
    case PRIVATE = 'private';
    case SECRET = 'secret';
}
