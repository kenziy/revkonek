<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ListingCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Parts & Components', 'children' => [
                'Engine Parts',
                'Exhaust Systems',
                'Suspension',
                'Brakes',
                'Electrical',
                'Bodywork & Fairings',
                'Wheels & Tires',
                'Chains & Sprockets',
            ]],
            ['name' => 'Accessories', 'children' => [
                'Mirrors',
                'Lights & Indicators',
                'Handlebars & Controls',
                'Seats',
                'Luggage & Storage',
                'Phone Mounts & GPS',
                'Covers & Protection',
            ]],
            ['name' => 'Riding Gear', 'children' => [
                'Helmets',
                'Jackets',
                'Pants',
                'Gloves',
                'Boots',
                'Rain Gear',
                'Protective Gear',
            ]],
            ['name' => 'Tools & Equipment', 'children' => [
                'Hand Tools',
                'Stands & Lifts',
                'Cleaning & Maintenance',
                'Diagnostic Tools',
            ]],
            ['name' => 'Complete Motorcycles', 'children' => [
                'Sport Bikes',
                'Naked Bikes',
                'Cruisers',
                'Scooters',
                'Underbones',
                'Adventure/Touring',
            ]],
            ['name' => 'Services', 'children' => [
                'Repairs & Maintenance',
                'Custom Work',
                'Painting',
                'Detailing',
            ]],
        ];

        $order = 0;
        foreach ($categories as $category) {
            $parentId = DB::table('listing_categories')->insertGetId([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'sort_order' => $order++,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $childOrder = 0;
            foreach ($category['children'] as $child) {
                DB::table('listing_categories')->insert([
                    'parent_id' => $parentId,
                    'name' => $child,
                    'slug' => Str::slug($child),
                    'sort_order' => $childOrder++,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
