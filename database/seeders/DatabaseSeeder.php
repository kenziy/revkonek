<?php

namespace Database\Seeders;

use App\Models\Club\ClubSubscriptionSetting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
            SubscriptionPlanSeeder::class,
            ListingCategorySeeder::class,
            VehicleTypeSeeder::class,
            VehicleCategorySeeder::class,
            SystemSettingsSeeder::class,
        ]);

        // Create test admin user
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@admin.com',
            'username' => 'admin',
            'password' => Hash::make('admin'),
        ]);
        $admin->assignRole('admin');

        // Create test regular user
        $user = User::factory()->create([
            'name' => 'Test Rider',
            'email' => 'test@test.com',
            'username' => 'test',
        ]);
        $user->assignRole('user');

        // Default club subscription pricing
        ClubSubscriptionSetting::firstOrCreate(
            [],
            [
                'yearly_price' => 999.00,
                'currency' => 'PHP',
                'description' => 'Unlock all Pro features for your club for 1 year.',
                'is_active' => true,
            ],
        );

        $this->call(ClubSeeder::class);
    }
}
