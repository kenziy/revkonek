<?php

namespace Database\Seeders;

use App\Models\VehicleCategory;
use App\Models\VehicleType;
use Illuminate\Database\Seeder;

class VehicleCategorySeeder extends Seeder
{
    public function run(): void
    {
        // Bike categories (from BikeCategory enum)
        $bikeType = VehicleType::where('slug', 'bike')->first();
        if ($bikeType) {
            $bikeCategories = [
                ['slug' => 'sport', 'name' => 'Sport'],
                ['slug' => 'naked', 'name' => 'Naked'],
                ['slug' => 'cruiser', 'name' => 'Cruiser'],
                ['slug' => 'touring', 'name' => 'Touring'],
                ['slug' => 'adventure', 'name' => 'Adventure'],
                ['slug' => 'scooter', 'name' => 'Scooter'],
                ['slug' => 'underbone', 'name' => 'Underbone'],
                ['slug' => 'dual_sport', 'name' => 'Dual Sport'],
                ['slug' => 'supermoto', 'name' => 'Supermoto'],
                ['slug' => 'cafe_racer', 'name' => 'Cafe Racer'],
                ['slug' => 'bobber', 'name' => 'Bobber'],
                ['slug' => 'scrambler', 'name' => 'Scrambler'],
                ['slug' => 'other', 'name' => 'Other'],
            ];

            foreach ($bikeCategories as $index => $category) {
                VehicleCategory::updateOrCreate(
                    [
                        'vehicle_type_id' => $bikeType->id,
                        'slug' => $category['slug'],
                    ],
                    [
                        'name' => $category['name'],
                        'is_enabled' => true,
                        'sort_order' => $index + 1,
                    ]
                );
            }
        }

        // Car categories (from CarCategory enum)
        $carType = VehicleType::where('slug', 'car')->first();
        if ($carType) {
            $carCategories = [
                ['slug' => 'sedan', 'name' => 'Sedan'],
                ['slug' => 'coupe', 'name' => 'Coupe'],
                ['slug' => 'hatchback', 'name' => 'Hatchback'],
                ['slug' => 'suv', 'name' => 'SUV'],
                ['slug' => 'truck', 'name' => 'Truck'],
                ['slug' => 'sports', 'name' => 'Sports'],
                ['slug' => 'muscle', 'name' => 'Muscle'],
                ['slug' => 'luxury', 'name' => 'Luxury'],
                ['slug' => 'electric', 'name' => 'Electric'],
                ['slug' => 'wagon', 'name' => 'Wagon'],
                ['slug' => 'convertible', 'name' => 'Convertible'],
                ['slug' => 'van', 'name' => 'Van'],
                ['slug' => 'other', 'name' => 'Other'],
            ];

            foreach ($carCategories as $index => $category) {
                VehicleCategory::updateOrCreate(
                    [
                        'vehicle_type_id' => $carType->id,
                        'slug' => $category['slug'],
                    ],
                    [
                        'name' => $category['name'],
                        'is_enabled' => true,
                        'sort_order' => $index + 1,
                    ]
                );
            }
        }
    }
}
