<?php

namespace Database\Seeders;

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
            'email' => 'rider@revkonek.com',
            'username' => 'testrider',
        ]);
        $user->assignRole('user');
    }
}
