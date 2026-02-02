<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVehicleRequest;
use App\Http\Requests\UpdateVehicleRequest;
use App\Models\Vehicle;
use App\Models\VehicleCategory;
use App\Models\VehicleType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller
{
    public function index(): Response
    {
        $vehicles = Auth::user()->vehicles()
            ->with(['vehicleType', 'category', 'primaryPhoto', 'bikeDetails', 'carDetails'])
            ->orderByDesc('is_active')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($vehicle) => $this->transformVehicle($vehicle));

        return Inertia::render('Vehicles/Index', [
            'vehicles' => $vehicles,
        ]);
    }

    public function create(): Response
    {
        $vehicleTypes = VehicleType::enabled()
            ->ordered()
            ->with('enabledCategories')
            ->get()
            ->map(fn ($type) => [
                'id' => $type->id,
                'slug' => $type->slug,
                'name' => $type->name,
                'icon' => $type->icon,
                'categories' => $type->enabledCategories->map(fn ($cat) => [
                    'id' => $cat->id,
                    'slug' => $cat->slug,
                    'name' => $cat->name,
                ]),
            ]);

        return Inertia::render('Vehicles/Create', [
            'vehicleTypes' => $vehicleTypes,
        ]);
    }

    public function store(StoreVehicleRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $vehicleType = VehicleType::find($validated['vehicle_type_id']);

        // Create vehicle
        $vehicle = Auth::user()->vehicles()->create([
            'vehicle_type_id' => $validated['vehicle_type_id'],
            'vehicle_category_id' => $validated['vehicle_category_id'] ?? null,
            'make' => $validated['make'],
            'model' => $validated['model'],
            'year' => $validated['year'],
            'modification_level' => $validated['modification_level'],
            'color' => $validated['color'] ?? null,
            'plate_number' => $validated['plate_number'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'is_active' => $validated['is_active'] ?? false,
            'is_available_for_match' => $validated['is_available_for_match'] ?? false,
        ]);

        // If setting as active, deactivate other vehicles
        if ($validated['is_active'] ?? false) {
            Auth::user()->vehicles()->where('id', '!=', $vehicle->id)->update(['is_active' => false]);
        }

        // Create type-specific details
        if ($vehicleType->isBike()) {
            $vehicle->bikeDetails()->create([
                'cc' => $validated['cc'],
            ]);
        } elseif ($vehicleType->isCar()) {
            $vehicle->carDetails()->create([
                'engine_liters' => $validated['engine_liters'] ?? null,
                'horsepower' => $validated['horsepower'] ?? null,
                'transmission' => $validated['transmission'] ?? null,
                'drivetrain' => $validated['drivetrain'] ?? null,
                'doors' => $validated['doors'] ?? null,
            ]);
        }

        // Handle photo upload
        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $path = $file->store('vehicles/'.$vehicle->id, 'public');
            $vehicle->photos()->create([
                'path' => $path,
                'filename' => $file->getClientOriginalName(),
                'is_primary' => true,
            ]);
        }

        return redirect()->route('vehicles.show', $vehicle->id)
            ->with('success', 'Vehicle added successfully!');
    }

    public function show(Vehicle $vehicle): Response
    {
        $vehicle->load(['vehicleType', 'category', 'photos', 'bikeDetails', 'carDetails', 'user']);

        return Inertia::render('Vehicles/Show', [
            'vehicle' => $this->transformVehicleDetail($vehicle),
            'isOwner' => Auth::id() === $vehicle->user_id,
        ]);
    }

    public function edit(Vehicle $vehicle): Response
    {
        $this->authorize('update', $vehicle);

        $vehicle->load(['vehicleType', 'category', 'primaryPhoto', 'bikeDetails', 'carDetails']);

        $categories = VehicleCategory::where('vehicle_type_id', $vehicle->vehicle_type_id)
            ->enabled()
            ->ordered()
            ->get()
            ->map(fn ($cat) => [
                'id' => $cat->id,
                'slug' => $cat->slug,
                'name' => $cat->name,
            ]);

        return Inertia::render('Vehicles/Edit', [
            'vehicle' => $this->transformVehicleForEdit($vehicle),
            'categories' => $categories,
        ]);
    }

    public function update(UpdateVehicleRequest $request, Vehicle $vehicle): RedirectResponse
    {
        $this->authorize('update', $vehicle);

        $validated = $request->validated();

        $vehicle->update([
            'vehicle_category_id' => $validated['vehicle_category_id'] ?? null,
            'make' => $validated['make'],
            'model' => $validated['model'],
            'year' => $validated['year'],
            'modification_level' => $validated['modification_level'],
            'color' => $validated['color'] ?? null,
            'plate_number' => $validated['plate_number'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'is_active' => $validated['is_active'] ?? false,
            'is_available_for_match' => $validated['is_available_for_match'] ?? false,
        ]);

        // If setting as active, deactivate other vehicles
        if ($validated['is_active'] ?? false) {
            Auth::user()->vehicles()->where('id', '!=', $vehicle->id)->update(['is_active' => false]);
        }

        // Update type-specific details
        if ($vehicle->vehicleType->isBike()) {
            $vehicle->bikeDetails()->updateOrCreate(
                ['vehicle_id' => $vehicle->id],
                ['cc' => $validated['cc']]
            );
        } elseif ($vehicle->vehicleType->isCar()) {
            $vehicle->carDetails()->updateOrCreate(
                ['vehicle_id' => $vehicle->id],
                [
                    'engine_liters' => $validated['engine_liters'] ?? null,
                    'horsepower' => $validated['horsepower'] ?? null,
                    'transmission' => $validated['transmission'] ?? null,
                    'drivetrain' => $validated['drivetrain'] ?? null,
                    'doors' => $validated['doors'] ?? null,
                ]
            );
        }

        // Handle photo upload
        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $path = $file->store('vehicles/'.$vehicle->id, 'public');

            // Mark existing photos as not primary
            $vehicle->photos()->update(['is_primary' => false]);

            $vehicle->photos()->create([
                'path' => $path,
                'filename' => $file->getClientOriginalName(),
                'is_primary' => true,
            ]);
        }

        return redirect()->route('vehicles.show', $vehicle->id)
            ->with('success', 'Vehicle updated successfully!');
    }

    public function destroy(Vehicle $vehicle): RedirectResponse
    {
        $this->authorize('delete', $vehicle);

        // Delete associated photos from storage
        foreach ($vehicle->photos as $photo) {
            Storage::disk('public')->delete($photo->path);
        }

        $vehicle->delete();

        return redirect()->route('vehicles.index')
            ->with('success', 'Vehicle removed.');
    }

    public function setActive(Vehicle $vehicle): RedirectResponse
    {
        $this->authorize('setActive', $vehicle);

        $vehicle->setAsActive();

        return back()->with('success', 'Primary vehicle updated!');
    }

    public function toggleMatchAvailability(Vehicle $vehicle): RedirectResponse
    {
        $this->authorize('toggleMatchAvailability', $vehicle);

        $vehicle->toggleMatchAvailability();

        $message = $vehicle->is_available_for_match
            ? "{$vehicle->display_name} is now available for match."
            : "{$vehicle->display_name} is no longer available for match.";

        return back()->with('success', $message);
    }

    private function transformVehicle(Vehicle $vehicle): array
    {
        return [
            'id' => $vehicle->id,
            'vehicleType' => [
                'slug' => $vehicle->vehicleType->slug,
                'name' => $vehicle->vehicleType->name,
            ],
            'category' => $vehicle->category ? [
                'slug' => $vehicle->category->slug,
                'name' => $vehicle->category->name,
            ] : null,
            'make' => $vehicle->make,
            'model' => $vehicle->model,
            'year' => $vehicle->year,
            'displayName' => $vehicle->display_name,
            'engineSpec' => $vehicle->engine_spec,
            'isActive' => $vehicle->is_active,
            'isAvailableForMatch' => $vehicle->is_available_for_match,
            'photo' => $vehicle->primaryPhoto?->path
                ? Storage::url($vehicle->primaryPhoto->path)
                : null,
        ];
    }

    private function transformVehicleDetail(Vehicle $vehicle): array
    {
        $data = $this->transformVehicle($vehicle);

        $data['modificationLevel'] = $vehicle->modification_level;
        $data['color'] = $vehicle->color;
        $data['plateNumber'] = $vehicle->plate_number;
        $data['notes'] = $vehicle->notes;
        $data['photos'] = $vehicle->photos->map(fn ($photo) => [
            'id' => $photo->id,
            'url' => Storage::url($photo->path),
            'isPrimary' => $photo->is_primary,
        ]);
        $data['owner'] = [
            'id' => $vehicle->user->id,
            'name' => $vehicle->user->name,
        ];

        if ($vehicle->vehicleType->isBike() && $vehicle->bikeDetails) {
            $data['bikeDetails'] = [
                'cc' => $vehicle->bikeDetails->cc,
            ];
        }

        if ($vehicle->vehicleType->isCar() && $vehicle->carDetails) {
            $data['carDetails'] = [
                'engineLiters' => $vehicle->carDetails->engine_liters,
                'horsepower' => $vehicle->carDetails->horsepower,
                'transmission' => $vehicle->carDetails->transmission,
                'transmissionLabel' => $vehicle->carDetails->getTransmissionLabel(),
                'drivetrain' => $vehicle->carDetails->drivetrain,
                'drivetrainLabel' => $vehicle->carDetails->getDrivetrainLabel(),
                'doors' => $vehicle->carDetails->doors,
            ];
        }

        return $data;
    }

    private function transformVehicleForEdit(Vehicle $vehicle): array
    {
        $data = [
            'id' => $vehicle->id,
            'vehicleTypeId' => $vehicle->vehicle_type_id,
            'vehicleCategoryId' => $vehicle->vehicle_category_id,
            'vehicleType' => [
                'slug' => $vehicle->vehicleType->slug,
                'name' => $vehicle->vehicleType->name,
            ],
            'make' => $vehicle->make,
            'model' => $vehicle->model,
            'year' => $vehicle->year,
            'modificationLevel' => $vehicle->modification_level,
            'color' => $vehicle->color,
            'plateNumber' => $vehicle->plate_number,
            'notes' => $vehicle->notes,
            'isActive' => $vehicle->is_active,
            'isAvailableForMatch' => $vehicle->is_available_for_match,
            'photo' => $vehicle->primaryPhoto?->path
                ? Storage::url($vehicle->primaryPhoto->path)
                : null,
        ];

        if ($vehicle->vehicleType->isBike() && $vehicle->bikeDetails) {
            $data['cc'] = $vehicle->bikeDetails->cc;
        }

        if ($vehicle->vehicleType->isCar() && $vehicle->carDetails) {
            $data['engineLiters'] = $vehicle->carDetails->engine_liters;
            $data['horsepower'] = $vehicle->carDetails->horsepower;
            $data['transmission'] = $vehicle->carDetails->transmission;
            $data['drivetrain'] = $vehicle->carDetails->drivetrain;
            $data['doors'] = $vehicle->carDetails->doors;
        }

        return $data;
    }
}
