<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('challenges', function (Blueprint $table) {
            $table->foreignId('challenger_vehicle_id')
                ->nullable()
                ->after('challenged_bike_id')
                ->constrained('vehicles')
                ->nullOnDelete();

            $table->foreignId('challenged_vehicle_id')
                ->nullable()
                ->after('challenger_vehicle_id')
                ->constrained('vehicles')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('challenges', function (Blueprint $table) {
            $table->dropForeign(['challenger_vehicle_id']);
            $table->dropForeign(['challenged_vehicle_id']);
            $table->dropColumn(['challenger_vehicle_id', 'challenged_vehicle_id']);
        });
    }
};
