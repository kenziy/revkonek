<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('vehicle_type_id')->constrained()->cascadeOnDelete();
            $table->foreignId('vehicle_category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('make');
            $table->string('model');
            $table->unsignedSmallInteger('year');
            $table->string('modification_level')->default('stock');
            $table->string('color')->nullable();
            $table->string('plate_number')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(false);
            $table->boolean('is_available_for_match')->default(false);
            $table->unsignedBigInteger('legacy_bike_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('user_id');
            $table->index(['user_id', 'is_active']);
            $table->index(['user_id', 'is_available_for_match']);
            $table->index('vehicle_type_id');
            $table->index('vehicle_category_id');
            $table->index('legacy_bike_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
