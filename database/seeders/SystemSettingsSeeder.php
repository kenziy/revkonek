<?php

namespace Database\Seeders;

use App\Models\SystemSetting;
use Illuminate\Database\Seeder;

class SystemSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // Match settings
            [
                'group' => 'match',
                'key' => 'enabled',
                'value' => 'true',
                'type' => 'boolean',
                'description' => 'Enable/disable the match feature',
            ],
            [
                'group' => 'match',
                'key' => 'max_distance_km',
                'value' => '50',
                'type' => 'integer',
                'description' => 'Maximum distance for matching in kilometers',
            ],

            // Vehicle settings
            [
                'group' => 'vehicles',
                'key' => 'max_photos_per_vehicle',
                'value' => '10',
                'type' => 'integer',
                'description' => 'Maximum number of photos allowed per vehicle',
            ],
            [
                'group' => 'vehicles',
                'key' => 'photo_max_size_kb',
                'value' => '5120',
                'type' => 'integer',
                'description' => 'Maximum photo file size in KB',
            ],

            // Challenge settings
            [
                'group' => 'challenges',
                'key' => 'expiry_hours',
                'value' => '24',
                'type' => 'integer',
                'description' => 'Hours before a pending challenge expires',
            ],
        ];

        foreach ($settings as $setting) {
            SystemSetting::updateOrCreate(
                [
                    'group' => $setting['group'],
                    'key' => $setting['key'],
                ],
                $setting
            );
        }
    }
}
