<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubscriptionPlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Free',
                'slug' => 'free',
                'description' => 'Basic features for casual riders',
                'price' => 0,
                'currency' => 'PHP',
                'billing_period' => 'monthly',
                'features' => json_encode([
                    'max_bikes' => 2,
                    'max_groups' => 3,
                    'daily_discovery_limit' => 10,
                    'daily_message_limit' => 20,
                    'basic_sos' => true,
                    'basic_matching' => true,
                    'ads' => true,
                ]),
                'is_active' => true,
                'sort_order' => 0,
            ],
            [
                'name' => 'Premium Monthly',
                'slug' => 'premium-monthly',
                'description' => 'Full access to all REV KONEK features',
                'price' => 199,
                'currency' => 'PHP',
                'billing_period' => 'monthly',
                'features' => json_encode([
                    'max_bikes' => -1, // unlimited
                    'max_groups' => -1,
                    'daily_discovery_limit' => -1,
                    'daily_message_limit' => -1,
                    'priority_sos' => true,
                    'advanced_matching' => true,
                    'challenge_analytics' => true,
                    'profile_boost' => true,
                    'custom_themes' => true,
                    'priority_support' => true,
                    'ads' => false,
                ]),
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Premium Yearly',
                'slug' => 'premium-yearly',
                'description' => 'Full access to all REV KONEK features - Save 2 months!',
                'price' => 1990,
                'currency' => 'PHP',
                'billing_period' => 'yearly',
                'features' => json_encode([
                    'max_bikes' => -1,
                    'max_groups' => -1,
                    'daily_discovery_limit' => -1,
                    'daily_message_limit' => -1,
                    'priority_sos' => true,
                    'advanced_matching' => true,
                    'challenge_analytics' => true,
                    'profile_boost' => true,
                    'custom_themes' => true,
                    'priority_support' => true,
                    'ads' => false,
                ]),
                'is_active' => true,
                'sort_order' => 2,
            ],
        ];

        foreach ($plans as $plan) {
            $plan['created_at'] = now();
            $plan['updated_at'] = now();
            DB::table('subscription_plans')->insert($plan);
        }
    }
}
