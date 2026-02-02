<?php

namespace App\Http\Controllers;

use App\Models\Bike;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class GarageController extends Controller
{
    public function index(): Response
    {
        $bikes = Auth::user()->bikes()
            ->with('primaryPhoto')
            ->orderByDesc('is_active')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($bike) => [
                'id' => $bike->id,
                'make' => $bike->make,
                'model' => $bike->model,
                'year' => $bike->year,
                'cc' => $bike->cc,
                'isPrimary' => $bike->is_active,
                'photo' => $bike->primaryPhoto?->path
                    ? Storage::url($bike->primaryPhoto->path)
                    : null,
            ]);

        return Inertia::render('Garage/Index', [
            'bikes' => $bikes,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Garage/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'make' => ['required', 'string', 'max:100'],
            'model' => ['required', 'string', 'max:100'],
            'year' => ['required', 'integer', 'min:1900', 'max:'.(date('Y') + 1)],
            'cc' => ['required', 'integer', 'min:50', 'max:3000'],
            'category' => ['required', 'string', Rule::in([
                'sport', 'naked', 'cruiser', 'touring', 'adventure',
                'scooter', 'underbone', 'dual_sport', 'supermoto',
                'cafe_racer', 'bobber', 'scrambler', 'other',
            ])],
            'modification_level' => ['required', 'string', Rule::in(['stock', 'mild', 'built'])],
            'color' => ['nullable', 'string', 'max:50'],
            'plate_number' => ['nullable', 'string', 'max:20'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'is_active' => ['boolean'],
            'photo' => ['nullable', 'image', 'max:5120'],
        ]);

        $bike = Auth::user()->bikes()->create($validated);

        // If setting as active, deactivate other bikes
        if ($validated['is_active'] ?? false) {
            Auth::user()->bikes()->where('id', '!=', $bike->id)->update(['is_active' => false]);
        }

        // Handle photo upload
        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $path = $file->store('bikes/'.$bike->id, 'public');
            $bike->photos()->create([
                'path' => $path,
                'filename' => $file->getClientOriginalName(),
                'is_primary' => true,
            ]);
        }

        return redirect()->route('garage.show', $bike->id)
            ->with('success', 'Bike added to your garage!');
    }

    public function show(Bike $bike): Response
    {
        $this->authorize('view', $bike);

        return Inertia::render('Garage/Show', [
            'id' => $bike->id,
            'bike' => [
                'id' => $bike->id,
                'make' => $bike->make,
                'model' => $bike->model,
                'year' => $bike->year,
                'cc' => $bike->cc,
                'category' => $bike->category?->value ?? $bike->category,
                'modification_level' => $bike->modification_level,
                'color' => $bike->color,
                'plate_number' => $bike->plate_number,
                'notes' => $bike->notes,
                'is_active' => $bike->is_active,
                'photo' => $bike->primaryPhoto?->path
                    ? Storage::url($bike->primaryPhoto->path)
                    : null,
                'photos' => $bike->photos->map(fn ($photo) => [
                    'id' => $photo->id,
                    'url' => Storage::url($photo->path),
                    'is_primary' => $photo->is_primary,
                ]),
            ],
        ]);
    }

    public function edit(Bike $bike): Response
    {
        $this->authorize('update', $bike);

        return Inertia::render('Garage/Edit', [
            'id' => $bike->id,
            'bike' => [
                'id' => $bike->id,
                'make' => $bike->make,
                'model' => $bike->model,
                'year' => $bike->year,
                'cc' => $bike->cc,
                'category' => $bike->category?->value ?? $bike->category,
                'modification_level' => $bike->modification_level,
                'color' => $bike->color,
                'plate_number' => $bike->plate_number,
                'notes' => $bike->notes,
                'is_active' => $bike->is_active,
                'photo' => $bike->primaryPhoto?->path
                    ? Storage::url($bike->primaryPhoto->path)
                    : null,
            ],
        ]);
    }

    public function update(Request $request, Bike $bike): RedirectResponse
    {
        $this->authorize('update', $bike);

        $validated = $request->validate([
            'make' => ['required', 'string', 'max:100'],
            'model' => ['required', 'string', 'max:100'],
            'year' => ['required', 'integer', 'min:1900', 'max:'.(date('Y') + 1)],
            'cc' => ['required', 'integer', 'min:50', 'max:3000'],
            'category' => ['required', 'string', Rule::in([
                'sport', 'naked', 'cruiser', 'touring', 'adventure',
                'scooter', 'underbone', 'dual_sport', 'supermoto',
                'cafe_racer', 'bobber', 'scrambler', 'other',
            ])],
            'modification_level' => ['required', 'string', Rule::in(['stock', 'mild', 'built'])],
            'color' => ['nullable', 'string', 'max:50'],
            'plate_number' => ['nullable', 'string', 'max:20'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'is_active' => ['boolean'],
            'photo' => ['nullable', 'image', 'max:5120'],
        ]);

        $bike->update($validated);

        // If setting as active, deactivate other bikes
        if ($validated['is_active'] ?? false) {
            Auth::user()->bikes()->where('id', '!=', $bike->id)->update(['is_active' => false]);
        }

        // Handle photo upload
        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $path = $file->store('bikes/'.$bike->id, 'public');

            // Mark existing photos as not primary
            $bike->photos()->update(['is_primary' => false]);

            $bike->photos()->create([
                'path' => $path,
                'filename' => $file->getClientOriginalName(),
                'is_primary' => true,
            ]);
        }

        return redirect()->route('garage.show', $bike->id)
            ->with('success', 'Bike updated successfully!');
    }

    public function destroy(Bike $bike): RedirectResponse
    {
        $this->authorize('delete', $bike);

        // Delete associated photos from storage
        foreach ($bike->photos as $photo) {
            Storage::disk('public')->delete($photo->path);
        }

        $bike->delete();

        return redirect()->route('garage.index')
            ->with('success', 'Bike removed from your garage.');
    }

    public function setActive(Bike $bike): RedirectResponse
    {
        $this->authorize('update', $bike);

        // Deactivate all other bikes for this user
        Auth::user()->bikes()->update(['is_active' => false]);

        // Set this bike as active
        $bike->update(['is_active' => true]);

        return back()->with('success', 'Primary bike updated!');
    }
}
