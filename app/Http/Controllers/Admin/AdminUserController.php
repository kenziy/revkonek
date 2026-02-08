<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscription\Subscription;
use App\Models\Subscription\SubscriptionPlan;
use App\Models\User;
use App\Services\AdminService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class AdminUserController extends Controller
{
    public function __construct(
        private AdminService $adminService,
    ) {}

    public function index(Request $request): Response
    {
        $query = User::query()
            ->withCount(['clubs', 'vehicles']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%");
            });
        }

        if ($request->input('role')) {
            $query->role($request->input('role'));
        }

        if ($request->input('status') === 'active') {
            $query->where('is_active', true);
        } elseif ($request->input('status') === 'banned') {
            $query->where('is_active', false);
        }

        $users = $query->orderByDesc('created_at')->paginate(20)->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role', 'status']),
            'roles' => Role::pluck('name'),
        ]);
    }

    public function show(User $user): Response
    {
        $user->load(['clubs', 'vehicles']);
        $userRoles = $user->getRoleNames();
        $userPermissions = $user->getAllPermissions()->pluck('name');

        $recentActivity = DB::table('audit_logs')
            ->where('auditable_type', User::class)
            ->where('auditable_id', $user->id)
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        $activeSubscription = Subscription::where('user_id', $user->id)
            ->whereIn('status', ['active', 'trialing'])
            ->first();

        return Inertia::render('Admin/Users/Show', [
            'user' => array_merge($user->toArray(), [
                'is_premium' => $user->isPremium(),
            ]),
            'userRoles' => $userRoles,
            'userPermissions' => $userPermissions,
            'allRoles' => Role::pluck('name'),
            'recentActivity' => $recentActivity,
            'stats' => [
                'clubsCount' => $user->clubs_count,
                'vehiclesCount' => $user->vehicles_count,
                'challengesSent' => DB::table('challenges')->where('challenger_id', $user->id)->count(),
                'challengesReceived' => DB::table('challenges')->where('challenged_id', $user->id)->count(),
            ],
            'activeSubscription' => $activeSubscription,
            'subscriptionPlans' => SubscriptionPlan::where('is_active', true)->orderBy('sort_order')->get(),
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'username' => 'nullable|string|max:255|unique:users,username,' . $user->id,
        ]);

        $oldValues = $user->only(['name', 'email', 'username']);
        $user->update($validated);

        $this->adminService->logAction(
            'user.updated',
            User::class,
            $user->id,
            $oldValues,
            $validated,
        );

        return back()->with('success', 'User updated successfully.');
    }

    public function ban(User $user): RedirectResponse
    {
        $user->update(['is_active' => false]);

        $this->adminService->logAction('user.banned', User::class, $user->id);

        return back()->with('success', 'User has been banned.');
    }

    public function unban(User $user): RedirectResponse
    {
        $user->update(['is_active' => true]);

        $this->adminService->logAction('user.unbanned', User::class, $user->id);

        return back()->with('success', 'User has been unbanned.');
    }

    public function verify(User $user): RedirectResponse
    {
        $user->update(['email_verified_at' => now()]);

        $this->adminService->logAction('user.verified', User::class, $user->id);

        return back()->with('success', 'User email has been verified.');
    }

    public function syncRoles(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'roles' => 'required|array',
            'roles.*' => 'string|exists:roles,name',
        ]);

        $oldRoles = $user->getRoleNames()->toArray();
        $user->syncRoles($validated['roles']);

        $this->adminService->logAction(
            'user.roles_synced',
            User::class,
            $user->id,
            ['roles' => $oldRoles],
            ['roles' => $validated['roles']],
        );

        return back()->with('success', 'User roles updated.');
    }
}
