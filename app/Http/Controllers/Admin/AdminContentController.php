<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AdminService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminContentController extends Controller
{
    public function __construct(
        private AdminService $adminService,
    ) {}

    public function index(Request $request): Response
    {
        $type = $request->input('type', 'posts');

        $content = collect();

        if ($type === 'posts') {
            $content = DB::table('club_posts')
                ->leftJoin('users', 'club_posts.user_id', '=', 'users.id')
                ->leftJoin('clubs', 'club_posts.club_id', '=', 'clubs.id')
                ->select(
                    'club_posts.id',
                    'club_posts.content',
                    'club_posts.is_announcement',
                    'club_posts.visibility',
                    'club_posts.created_at',
                    'users.name as user_name',
                    'clubs.name as club_name',
                )
                ->orderByDesc('club_posts.created_at')
                ->paginate(20)
                ->withQueryString();
        }

        return Inertia::render('Admin/Content/Index', [
            'content' => $content,
            'filters' => ['type' => $type],
        ]);
    }

    public function destroy(string $type, int $id): RedirectResponse
    {
        $table = match ($type) {
            'posts' => 'club_posts',
            default => abort(404),
        };

        DB::table($table)->where('id', $id)->delete();

        $this->adminService->logAction("content.{$type}.deleted", $type, $id);

        return back()->with('success', 'Content has been deleted.');
    }
}
