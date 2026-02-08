<?php

namespace App\Console\Commands;

use App\Services\ClubSubscriptionService;
use Illuminate\Console\Command;

class ExpireClubSubscriptions extends Command
{
    protected $signature = 'clubs:expire-subscriptions';

    protected $description = 'Expire club subscriptions that have passed their end date';

    public function handle(ClubSubscriptionService $service): int
    {
        $count = $service->expireOverdueSubscriptions();

        $this->info("Expired {$count} club subscription(s).");

        return self::SUCCESS;
    }
}
