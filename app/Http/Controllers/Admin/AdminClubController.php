<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Club\Club;
use App\Services\AdminService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminClubController extends Controller
{
    public function __construct(
        private AdminService $adminService,
    ) {}

    public function index(Request $request): Response
    {
        $query = Club::query()
            ->withCount('members')
            ->with('owner:id,name,username');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        if ($type = $request->input('type')) {
            $query->where('type', $type);
        }

        if ($request->input('status') === 'active') {
            $query->where('is_active', true)->where('is_archived', false);
        } elseif ($request->input('status') === 'archived') {
            $query->where('is_archived', true);
        } elseif ($request->input('status') === 'verified') {
            $query->where('is_verified', true);
        }

        $clubs = $query->orderByDesc('created_at')->paginate(20)->withQueryString();

        return Inertia::render('Admin/Clubs/Index', [
            'clubs' => $clubs,
            'filters' => $request->only(['search', 'type', 'status']),
        ]);
    }

    public function show(Club $club): Response
    {
        $club->load(['owner:id,name,username,email', 'members']);
        $club->loadCount(['members', 'posts', 'events', 'followers']);

        return Inertia::render('Admin/Clubs/Show', [
            'club' => $club,
        ]);
    }

    public function update(Request $request, Club $club): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|string|in:public,private,secret',
        ]);

        $oldValues = $club->only(['name', 'description', 'type']);
        $club->update($validated);

        $this->adminService->logAction(
            'club.updated',
            Club::class,
            $club->id,
            $oldValues,
            $validated,
        );

        return back()->with('success', 'Club updated successfully.');
    }

    public function archive(Club $club): RedirectResponse
    {
        $club->update(['is_archived' => true, 'archived_at' => now()]);

        $this->adminService->logAction('club.archived', Club::class, $club->id);

        return back()->with('success', 'Club has been archived.');
    }

    public function unarchive(Club $club): RedirectResponse
    {
        $club->update(['is_archived' => false, 'archived_at' => null]);

        $this->adminService->logAction('club.unarchived', Club::class, $club->id);

        return back()->with('success', 'Club has been unarchived.');
    }

    public function verify(Club $club): RedirectResponse
    {
        $club->update(['is_verified' => true]);

        $this->adminService->logAction('club.verified', Club::class, $club->id);

        return back()->with('success', 'Club has been verified.');
    }

    public function destroy(Club $club): RedirectResponse
    {
        $this->adminService->logAction('club.deleted', Club::class, $club->id, [
            'name' => $club->name,
            'slug' => $club->slug,
        ]);

        $club->delete();

        return redirect()->route('admin.clubs.index')->with('success', 'Club has been deleted.');
    }
}
