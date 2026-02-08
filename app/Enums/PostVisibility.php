<?php

namespace App\Enums;

enum PostVisibility: string
{
    case PUBLIC = 'public';
    case MEMBERS_ONLY = 'members_only';
}
