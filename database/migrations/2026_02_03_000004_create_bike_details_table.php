<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bike_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->unique()->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('cc'); // Engine displacement
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bike_details');
    }
};
