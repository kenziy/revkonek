<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'totalUsers' => DB::table('users')->count(),
            'activeUsers' => DB::table('users')->where('is_active', true)->count(),
            'newUsersToday' => DB::table('users')->whereDate('created_at', today())->count(),
            'newUsersThisWeek' => DB::table('users')->where('created_at', '>=', now()->subWeek())->count(),
            'totalClubs' => DB::table('clubs')->count(),
            'activeClubs' => DB::table('clubs')->where('is_active', true)->where('is_archived', false)->count(),
            'totalShops' => DB::table('shops')->count(),
            'pendingShopVerifications' => DB::table('shops')->where('verification_status', 'pending')->count(),
            'totalSubscriptions' => DB::table('subscriptions')->where('status', 'active')->count(),
        ];

        $recentUsers = DB::table('users')
            ->select('id', 'name', 'username', 'email', 'is_active', 'created_at')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        $recentAuditLogs = DB::table('audit_logs')
            ->leftJoin('users', 'audit_logs.user_id', '=', 'users.id')
            ->select('audit_logs.*', 'users.name as user_name')
            ->orderByDesc('audit_logs.created_at')
            ->limit(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentUsers' => $recentUsers,
            'recentAuditLogs' => $recentAuditLogs,
        ]);
    }
}
