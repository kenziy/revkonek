<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVehicleModRequest;
use App\Http\Requests\StoreVehicleRequest;
use App\Http\Requests\StoreVehicleSocialLinkRequest;
use App\Http\Requests\UpdateVehicleCustomizationRequest;
use App\Http\Requests\UpdateVehicleRequest;
use App\Models\Vehicle;
use App\Models\VehicleCategory;
use App\Models\VehicleMod;
use App\Models\VehiclePhoto;
use App\Models\VehicleSocialLink;
use App\Models\VehicleType;
use App\Services\UserService;
use App\Services\YouTubeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller
{
    public function __construct(
        private readonly UserService $userService,
    ) {}
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

        // Handle multi-photo upload (premium) or single photo
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $index => $file) {
                $path = $file->store('vehicles/'.$vehicle->id, 'public');
                $vehicle->photos()->create([
                    'path' => $path,
                    'filename' => $file->getClientOriginalName(),
                    'is_primary' => $index === 0,
                    'sort_order' => $index,
                ]);
            }
        } elseif ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $path = $file->store('vehicles/'.$vehicle->id, 'public');
            $vehicle->photos()->create([
                'path' => $path,
                'filename' => $file->getClientOriginalName(),
                'is_primary' => true,
            ]);
        }

        return redirect()->route('vehicles.show', $vehicle->uuid)
            ->with('success', 'Vehicle added successfully!');
    }

    public function show(Vehicle $vehicle): Response
    {
        $vehicle->load(['vehicleType', 'category', 'photos', 'bikeDetails', 'carDetails', 'user.profile']);
        $vehicle->loadCount('likedBy');

        $ownerIsPremium = $vehicle->user->isPremium();

        if ($ownerIsPremium) {
            $vehicle->load(['mods', 'socialLinks']);
        }

        $authUser = Auth::user();

        return Inertia::render('Vehicles/Show', [
            'vehicle' => $this->transformVehicleDetail($vehicle, $ownerIsPremium),
            'isOwner' => Auth::id() === $vehicle->user_id,
            'ownerIsPremium' => $ownerIsPremium,
            'isLiked' => $authUser ? $authUser->hasLikedVehicle($vehicle) : false,
            'likesCount' => $vehicle->liked_by_count,
        ]);
    }

    public function edit(Vehicle $vehicle): Response
    {
        $this->authorize('update', $vehicle);

        $vehicle->load(['vehicleType', 'category', 'primaryPhoto', 'photos', 'bikeDetails', 'carDetails']);

        $isPremium = Auth::user()->isPremium();

        if ($isPremium) {
            $vehicle->load(['mods', 'socialLinks']);
        }

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
            'vehicle' => $this->transformVehicleForEdit($vehicle, $isPremium),
            'categories' => $categories,
            'isPremium' => $isPremium,
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

        return redirect()->route('vehicles.show', $vehicle->uuid)
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

    public function toggleLike(Vehicle $vehicle): RedirectResponse
    {
        $this->userService->toggleVehicleLike(Auth::user(), $vehicle);

        return back();
    }

    // --- Pro Customization Methods ---

    public function updateCustomization(UpdateVehicleCustomizationRequest $request, Vehicle $vehicle): RedirectResponse
    {
        $validated = $request->validated();

        $updateData = [];

        if (array_key_exists('layout_template', $validated)) {
            $updateData['layout_template'] = $validated['layout_template'];
        }
        if (array_key_exists('accent_color', $validated)) {
            $updateData['accent_color'] = $validated['accent_color'];
        }
        if (array_key_exists('background_style', $validated)) {
            $updateData['background_style'] = $validated['background_style'];
        }
        if (array_key_exists('story', $validated)) {
            $updateData['story'] = $validated['story'];
        }
        if (array_key_exists('youtube_autoplay', $validated)) {
            $updateData['youtube_autoplay'] = $validated['youtube_autoplay'];
        }

        if (array_key_exists('youtube_url', $validated)) {
            $youtubeUrl = $validated['youtube_url'];
            $updateData['youtube_url'] = $youtubeUrl;
            $updateData['youtube_video_id'] = YouTubeService::extractVideoId($youtubeUrl);
        }

        // Handle cover image upload
        if ($request->hasFile('cover_image')) {
            // Delete old cover image
            if ($vehicle->cover_image_path) {
                Storage::disk('public')->delete($vehicle->cover_image_path);
            }
            $updateData['cover_image_path'] = $request->file('cover_image')
                ->store('vehicles/'.$vehicle->id.'/covers', 'public');
        }

        $vehicle->update($updateData);

        return back()->with('success', 'Customization updated!');
    }

    public function storePhotos(Request $request, Vehicle $vehicle): RedirectResponse
    {
        $this->authorize('update', $vehicle);

        if (! $request->user()->isPremium()) {
            abort(403, 'Premium subscription required.');
        }

        $maxPhotos = $request->user()->getSubscriptionTier()->maxVehiclePhotos();
        $currentCount = $vehicle->photos()->count();

        $request->validate([
            'photos' => ['required', 'array', 'max:'.($maxPhotos - $currentCount)],
            'photos.*' => ['image', 'max:5120'],
        ]);

        $sortOrder = $vehicle->photos()->max('sort_order') ?? -1;

        foreach ($request->file('photos') as $file) {
            $sortOrder++;
            $path = $file->store('vehicles/'.$vehicle->id, 'public');
            $vehicle->photos()->create([
                'path' => $path,
                'filename' => $file->getClientOriginalName(),
                'is_primary' => $currentCount === 0 && $sortOrder === 0,
                'sort_order' => $sortOrder,
            ]);
            $currentCount++;
        }

        return back()->with('success', 'Photos uploaded!');
    }

    public function destroyPhoto(Vehicle $vehicle, VehiclePhoto $photo): RedirectResponse
    {
        $this->authorize('update', $vehicle);

        if ($photo->vehicle_id !== $vehicle->id) {
            abort(404);
        }

        $photo->deleteFile();
        $wasPrimary = $photo->is_primary;
        $photo->delete();

        // If deleted photo was primary, set next photo as primary
        if ($wasPrimary) {
            $nextPhoto = $vehicle->photos()->orderBy('sort_order')->first();
            $nextPhoto?->update(['is_primary' => true]);
        }

        return back()->with('success', 'Photo deleted.');
    }

    public function reorderPhotos(Request $request, Vehicle $vehicle): RedirectResponse
    {
        $this->authorize('update', $vehicle);

        $request->validate([
            'order' => ['required', 'array'],
            'order.*' => ['integer', 'exists:vehicle_photos,id'],
        ]);

        foreach ($request->input('order') as $index => $photoId) {
            VehiclePhoto::where('id', $photoId)
                ->where('vehicle_id', $vehicle->id)
                ->update(['sort_order' => $index]);
        }

        return back()->with('success', 'Photos reordered.');
    }

    public function setPrimaryPhoto(Vehicle $vehicle, VehiclePhoto $photo): RedirectResponse
    {
        $this->authorize('update', $vehicle);

        if ($photo->vehicle_id !== $vehicle->id) {
            abort(404);
        }

        $photo->setAsPrimary();

        return back()->with('success', 'Primary photo updated.');
    }

    public function storeMod(StoreVehicleModRequest $request, Vehicle $vehicle): RedirectResponse
    {
        $validated = $request->validated();

        $sortOrder = ($vehicle->mods()->max('sort_order') ?? -1) + 1;

        $vehicle->mods()->create([
            ...$validated,
            'sort_order' => $sortOrder,
        ]);

        return back()->with('success', 'Mod added!');
    }

    public function updateMod(Request $request, Vehicle $vehicle, VehicleMod $mod): RedirectResponse
    {
        $this->authorize('update', $vehicle);

        if (! $request->user()->isPremium() || $mod->vehicle_id !== $vehicle->id) {
            abort(403);
        }

        $validated = $request->validate([
            'category' => ['required', 'string'],
            'name' => ['required', 'string', 'max:255'],
            'brand' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'price' => ['nullable', 'numeric', 'min:0', 'max:9999999.99'],
            'installed_at' => ['nullable', 'date'],
        ]);

        $mod->update($validated);

        return back()->with('success', 'Mod updated!');
    }

    public function destroyMod(Vehicle $vehicle, VehicleMod $mod): RedirectResponse
    {
        $this->authorize('update', $vehicle);

        if ($mod->vehicle_id !== $vehicle->id) {
            abort(404);
        }

        $mod->delete();

        return back()->with('success', 'Mod removed.');
    }

    public function storeSocialLink(StoreVehicleSocialLinkRequest $request, Vehicle $vehicle): RedirectResponse
    {
        $validated = $request->validated();

        $sortOrder = ($vehicle->socialLinks()->max('sort_order') ?? -1) + 1;

        $vehicle->socialLinks()->create([
            ...$validated,
            'sort_order' => $sortOrder,
        ]);

        return back()->with('success', 'Social link added!');
    }

    public function destroySocialLink(Vehicle $vehicle, VehicleSocialLink $link): RedirectResponse
    {
        $this->authorize('update', $vehicle);

        if ($link->vehicle_id !== $vehicle->id) {
            abort(404);
        }

        $link->delete();

        return back()->with('success', 'Social link removed.');
    }

    // --- Transform Methods ---

    private function transformVehicle(Vehicle $vehicle): array
    {
        return [
            'id' => $vehicle->id,
            'uuid' => $vehicle->uuid,
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
            'photo' => $vehicle->primaryPhoto?->path
                ? Storage::url($vehicle->primaryPhoto->path)
                : null,
            'ownerIsPremium' => $vehicle->user?->isPremium() ?? false,
        ];
    }

    private function transformVehicleDetail(Vehicle $vehicle, bool $ownerIsPremium = false): array
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
            'uuid' => $vehicle->user->uuid,
            'name' => $vehicle->user->name,
            'displayName' => $vehicle->user->display_name,
            'username' => $vehicle->user->username,
            'avatar' => $vehicle->user->profile?->avatar,
            'isPremium' => $ownerIsPremium,
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

        // Pro fields
        if ($ownerIsPremium) {
            $data['story'] = $vehicle->story;
            $data['layoutTemplate'] = $vehicle->layout_template;
            $data['accentColor'] = $vehicle->accent_color;
            $data['backgroundStyle'] = $vehicle->background_style;
            $data['coverImage'] = $vehicle->cover_image_url;
            $data['youtubeVideoId'] = $vehicle->youtube_video_id;
            $data['youtubeAutoplay'] = $vehicle->youtube_autoplay;
            $data['mods'] = $vehicle->mods->map(fn ($mod) => [
                'id' => $mod->id,
                'category' => $mod->category->value,
                'categoryLabel' => $mod->category->label(),
                'name' => $mod->name,
                'brand' => $mod->brand,
                'description' => $mod->description,
                'price' => $mod->price,
                'currency' => $mod->currency,
                'installedAt' => $mod->installed_at?->format('Y-m-d'),
            ]);
            $data['socialLinks'] = $vehicle->socialLinks->map(fn ($link) => [
                'id' => $link->id,
                'platform' => $link->platform->value,
                'platformLabel' => $link->platform->label(),
                'url' => $link->url,
                'label' => $link->label,
            ]);
        }

        return $data;
    }

    private function transformVehicleForEdit(Vehicle $vehicle, bool $isPremium = false): array
    {
        $data = [
            'id' => $vehicle->id,
            'uuid' => $vehicle->uuid,
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
            'photo' => $vehicle->primaryPhoto?->path
                ? Storage::url($vehicle->primaryPhoto->path)
                : null,
            'photos' => $vehicle->photos->map(fn ($photo) => [
                'id' => $photo->id,
                'url' => Storage::url($photo->path),
                'isPrimary' => $photo->is_primary,
            ]),
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

        // Pro fields for editing
        if ($isPremium) {
            $data['layoutTemplate'] = $vehicle->layout_template;
            $data['accentColor'] = $vehicle->accent_color;
            $data['backgroundStyle'] = $vehicle->background_style;
            $data['story'] = $vehicle->story;
            $data['coverImage'] = $vehicle->cover_image_url;
            $data['youtubeUrl'] = $vehicle->youtube_url;
            $data['youtubeAutoplay'] = $vehicle->youtube_autoplay;
            $data['mods'] = $vehicle->mods->map(fn ($mod) => [
                'id' => $mod->id,
                'category' => $mod->category->value,
                'categoryLabel' => $mod->category->label(),
                'name' => $mod->name,
                'brand' => $mod->brand,
                'description' => $mod->description,
                'price' => $mod->price,
                'currency' => $mod->currency,
                'installedAt' => $mod->installed_at?->format('Y-m-d'),
            ]);
            $data['socialLinks'] = $vehicle->socialLinks->map(fn ($link) => [
                'id' => $link->id,
                'platform' => $link->platform->value,
                'platformLabel' => $link->platform->label(),
                'url' => $link->url,
                'label' => $link->label,
            ]);
        }

        return $data;
    }
}
