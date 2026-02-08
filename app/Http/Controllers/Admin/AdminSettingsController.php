<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use App\Models\User;
use App\Services\AdminService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class AdminSettingsController extends Controller
{
    public function __construct(
        private AdminService $adminService,
    ) {}

    public function index(): Response
    {
        $settings = DB::table('system_settings')
            ->orderBy('group')
            ->orderBy('key')
            ->get()
            ->groupBy('group');

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.id' => 'required|exists:system_settings,id',
            'settings.*.value' => 'nullable|string',
        ]);

        foreach ($validated['settings'] as $setting) {
            DB::table('system_settings')
                ->where('id', $setting['id'])
                ->update([
                    'value' => $setting['value'],
                    'updated_at' => now(),
                ]);
        }

        $this->adminService->logAction('settings.updated');

        return back()->with('success', 'Settings updated successfully.');
    }

    public function staff(): Response
    {
        $staffUsers = User::role(['admin', 'moderator', 'shop-admin'])
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'display_name' => $user->display_name,
                    'roles' => $user->getRoleNames(),
                    'created_at' => $user->created_at,
                ];
            });

        return Inertia::render('Admin/Settings/Staff', [
            'staffUsers' => $staffUsers,
            'allRoles' => Role::where('name', '!=', 'user')->pluck('name'),
        ]);
    }

    public function assignRole(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'role' => 'required|string|exists:roles,name',
        ]);

        $user->assignRole($validated['role']);

        $this->adminService->logAction(
            'staff.role_assigned',
            User::class,
            $user->id,
            null,
            ['role' => $validated['role']],
        );

        return back()->with('success', "Role '{$validated['role']}' assigned to {$user->display_name}.");
    }

    public function features(): Response
    {
        return Inertia::render('Admin/Settings/Features', [
            'features' => [
                'sos_enabled' => SystemSetting::get('features.sos_enabled', true),
            ],
        ]);
    }

    public function updateFeatures(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'sos_enabled' => 'required|boolean',
        ]);

        foreach ($validated as $key => $value) {
            SystemSetting::set('features', $key, $value ? 'true' : 'false', 'boolean');
        }

        $this->adminService->logAction('settings.features_updated', null, null, null, $validated);

        return back()->with('success', 'Feature flags updated successfully.');
    }

    public function revokeRole(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'role' => 'required|string|exists:roles,name',
        ]);

        $user->removeRole($validated['role']);

        $this->adminService->logAction(
            'staff.role_revoked',
            User::class,
            $user->id,
            ['role' => $validated['role']],
        );

        return back()->with('success', "Role '{$validated['role']}' revoked from {$user->display_name}.");
    }
}
