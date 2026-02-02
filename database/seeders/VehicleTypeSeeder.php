<?php

namespace Database\Seeders;

use App\Models\VehicleType;
use Illuminate\Database\Seeder;

class VehicleTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            [
                'slug' => 'bike',
                'name' => 'Motorcycle',
                'icon' => 'motorcycle',
                'is_enabled' => true,
                'sort_order' => 1,
            ],
            [
                'slug' => 'car',
                'name' => 'Car',
                'icon' => 'car',
                'is_enabled' => true,
                'sort_order' => 2,
            ],
        ];

        foreach ($types as $type) {
            VehicleType::updateOrCreate(
                ['slug' => $type['slug']],
                $type
            );
        }
    }
}
