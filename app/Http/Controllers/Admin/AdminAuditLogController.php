<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminAuditLogController extends Controller
{
    public function index(Request $request): Response
    {
        $query = DB::table('audit_logs')
            ->leftJoin('users', 'audit_logs.user_id', '=', 'users.id')
            ->select('audit_logs.*', 'users.name as user_name', 'users.email as user_email');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('audit_logs.action', 'like', "%{$search}%")
                    ->orWhere('users.name', 'like', "%{$search}%");
            });
        }

        if ($action = $request->input('action')) {
            $query->where('audit_logs.action', $action);
        }

        $logs = $query->orderByDesc('audit_logs.created_at')->paginate(30)->withQueryString();

        $actions = DB::table('audit_logs')
            ->distinct()
            ->pluck('action');

        return Inertia::render('Admin/AuditLogs/Index', [
            'logs' => $logs,
            'actions' => $actions,
            'filters' => $request->only(['search', 'action']),
        ]);
    }
}
