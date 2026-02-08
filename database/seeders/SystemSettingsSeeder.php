<?php

namespace Database\Seeders;

use App\Models\SystemSetting;
use Illuminate\Database\Seeder;

class SystemSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
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

            // Feature flags
            [
                'group' => 'features',
                'key' => 'sos_enabled',
                'value' => 'true',
                'type' => 'boolean',
                'description' => 'Enable or disable the SOS / Emergency feature',
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
