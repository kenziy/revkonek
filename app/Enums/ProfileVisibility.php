<?php

namespace App\Enums;

enum ProfileVisibility: string
{
    case PUBLIC = 'public';
    case CONNECTIONS_ONLY = 'connections_only';
    case HIDDEN = 'hidden';
}
