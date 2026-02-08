<?php

namespace App\Exceptions;

use Exception;

class ClubTierLimitException extends Exception
{
    public function __construct(string $feature)
    {
        parent::__construct("Upgrade to Pro to unlock {$feature}.");
    }
}
