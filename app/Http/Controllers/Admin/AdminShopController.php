<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AdminService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminShopController extends Controller
{
    public function __construct(
        private AdminService $adminService,
    ) {}

    public function index(Request $request): Response
    {
        $query = DB::table('shops')
            ->leftJoin('users', 'shops.owner_id', '=', 'users.id')
            ->select('shops.*', 'users.name as owner_name', 'users.email as owner_email');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('shops.name', 'like', "%{$search}%")
                    ->orWhere('shops.city', 'like', "%{$search}%");
            });
        }

        if ($status = $request->input('verification_status')) {
            $query->where('shops.verification_status', $status);
        }

        $shops = $query->orderByDesc('shops.created_at')->paginate(20)->withQueryString();

        return Inertia::render('Admin/Shops/Index', [
            'shops' => $shops,
            'filters' => $request->only(['search', 'verification_status']),
        ]);
    }

    public function show(int $shop): Response
    {
        $shopData = DB::table('shops')
            ->leftJoin('users', 'shops.owner_id', '=', 'users.id')
            ->select('shops.*', 'users.name as owner_name', 'users.email as owner_email')
            ->where('shops.id', $shop)
            ->first();

        abort_unless($shopData, 404);

        $listingsCount = DB::table('listings')->where('shop_id', $shop)->count();

        return Inertia::render('Admin/Shops/Show', [
            'shop' => $shopData,
            'listingsCount' => $listingsCount,
        ]);
    }

    public function verify(int $shop): RedirectResponse
    {
        DB::table('shops')->where('id', $shop)->update([
            'verification_status' => 'verified',
            'verified_at' => now(),
            'updated_at' => now(),
        ]);

        $this->adminService->logAction('shop.verified', 'App\\Models\\Shop\\Shop', $shop);

        return back()->with('success', 'Shop has been verified.');
    }

    public function reject(int $shop): RedirectResponse
    {
        DB::table('shops')->where('id', $shop)->update([
            'verification_status' => 'rejected',
            'updated_at' => now(),
        ]);

        $this->adminService->logAction('shop.rejected', 'App\\Models\\Shop\\Shop', $shop);

        return back()->with('success', 'Shop verification has been rejected.');
    }

    public function toggleActive(int $shop): RedirectResponse
    {
        $current = DB::table('shops')->where('id', $shop)->value('is_active');

        DB::table('shops')->where('id', $shop)->update([
            'is_active' => ! $current,
            'updated_at' => now(),
        ]);

        $action = $current ? 'shop.deactivated' : 'shop.activated';
        $this->adminService->logAction($action, 'App\\Models\\Shop\\Shop', $shop);

        $message = $current ? 'Shop has been deactivated.' : 'Shop has been activated.';

        return back()->with('success', $message);
    }
}
