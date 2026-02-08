<?php

namespace App\Http\Middleware;

use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? array_merge($user->toArray(), [
                    'avatar' => $user->profile?->avatar,
                ]) : null,
                'is_admin' => $user?->can('access-admin-panel') ?? false,
                'is_premium' => $user?->isPremium() ?? false,
                'subscription_tier' => $user?->getSubscriptionTier()->value ?? 'free',
                'roles' => $user?->getRoleNames()->toArray() ?? [],
                'permissions' => $user?->getAllPermissions()->pluck('name')->toArray() ?? [],
            ],
            'features' => [
                'sos' => SystemSetting::get('features.sos_enabled', true),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
