<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('car_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->unique()->constrained()->cascadeOnDelete();
            $table->decimal('engine_liters', 3, 1)->nullable(); // e.g., 2.0, 3.5
            $table->unsignedSmallInteger('horsepower')->nullable();
            $table->string('transmission')->nullable(); // manual, automatic, cvt, dct
            $table->string('drivetrain')->nullable(); // fwd, rwd, awd, 4wd
            $table->unsignedTinyInteger('doors')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('car_details');
    }
};
