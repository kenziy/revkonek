<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Get the bike vehicle type ID
        $bikeTypeId = DB::table('vehicle_types')->where('slug', 'bike')->value('id');

        if (! $bikeTypeId) {
            // If vehicle types haven't been seeded yet, skip migration
            return;
        }

        // Migrate bikes to vehicles
        $bikes = DB::table('bikes')->get();

        foreach ($bikes as $bike) {
            // Find the matching category
            $categoryId = DB::table('vehicle_categories')
                ->where('vehicle_type_id', $bikeTypeId)
                ->where('slug', $bike->category)
                ->value('id');

            // Create vehicle record
            $vehicleId = DB::table('vehicles')->insertGetId([
                'user_id' => $bike->user_id,
                'vehicle_type_id' => $bikeTypeId,
                'vehicle_category_id' => $categoryId,
                'make' => $bike->make,
                'model' => $bike->model,
                'year' => $bike->year,
                'modification_level' => $bike->modification_level,
                'color' => $bike->color,
                'plate_number' => $bike->plate_number,
                'notes' => $bike->notes,
                'is_active' => $bike->is_active,
                'is_available_for_match' => false,
                'legacy_bike_id' => $bike->id,
                'created_at' => $bike->created_at,
                'updated_at' => $bike->updated_at,
            ]);

            // Create bike details
            DB::table('bike_details')->insert([
                'vehicle_id' => $vehicleId,
                'cc' => $bike->cc,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Migrate photos
            $photos = DB::table('bike_photos')->where('bike_id', $bike->id)->get();
            foreach ($photos as $photo) {
                DB::table('vehicle_photos')->insert([
                    'vehicle_id' => $vehicleId,
                    'path' => $photo->path,
                    'filename' => $photo->filename,
                    'is_primary' => $photo->is_primary,
                    'sort_order' => $photo->sort_order,
                    'created_at' => $photo->created_at,
                    'updated_at' => $photo->updated_at,
                ]);
            }

            // Update challenges to use new vehicle IDs
            DB::table('challenges')
                ->where('challenger_bike_id', $bike->id)
                ->update(['challenger_vehicle_id' => $vehicleId]);

            DB::table('challenges')
                ->where('challenged_bike_id', $bike->id)
                ->update(['challenged_vehicle_id' => $vehicleId]);
        }
    }

    public function down(): void
    {
        // Clear migrated data
        DB::table('vehicle_photos')->truncate();
        DB::table('bike_details')->truncate();
        DB::table('car_details')->truncate();
        DB::table('vehicles')->truncate();

        // Reset vehicle IDs in challenges
        DB::table('challenges')->update([
            'challenger_vehicle_id' => null,
            'challenged_vehicle_id' => null,
        ]);
    }
};
