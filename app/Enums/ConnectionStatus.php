<?php

namespace App\Enums;

enum ConnectionStatus: string
{
    case PENDING = 'pending';
    case ACCEPTED = 'accepted';
    case REJECTED = 'rejected';
    case BLOCKED = 'blocked';
}
