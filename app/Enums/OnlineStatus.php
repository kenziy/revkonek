<?php

namespace App\Enums;

enum OnlineStatus: string
{
    case SHOW = 'show';
    case CONNECTIONS_ONLY = 'connections_only';
    case HIDE = 'hide';
}
