<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // User management
            'manage-users',
            'ban-users',
            'verify-users',

            // Group moderation
            'moderate-groups',
            'archive-groups',

            // Shop management
            'verify-shops',
            'manage-listings',
            'view-shop-documents',

            // Content moderation
            'moderate-content',
            'delete-content',

            // System
            'access-admin-panel',
            'view-audit-logs',
            'manage-subscriptions',
            'send-announcements',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        $admin = Role::create(['name' => 'admin']);
        $admin->givePermissionTo(Permission::all());

        $moderator = Role::create(['name' => 'moderator']);
        $moderator->givePermissionTo([
            'moderate-content',
            'delete-content',
            'moderate-groups',
        ]);

        $shopAdmin = Role::create(['name' => 'shop-admin']);
        $shopAdmin->givePermissionTo([
            'verify-shops',
            'manage-listings',
            'view-shop-documents',
        ]);

        // Regular user role (no special permissions)
        Role::create(['name' => 'user']);
    }
}
