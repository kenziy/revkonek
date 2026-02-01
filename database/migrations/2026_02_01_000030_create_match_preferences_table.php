<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('match_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('max_distance_km')->default(25);
            $table->boolean('willing_to_travel')->default(false);
            $table->json('preferred_bike_categories')->nullable();
            $table->unsignedSmallInteger('min_cc')->nullable();
            $table->unsignedSmallInteger('max_cc')->nullable();
            $table->json('preferred_challenge_types')->nullable();
            $table->decimal('min_skill_rating', 8, 2)->nullable();
            $table->decimal('max_skill_rating', 8, 2)->nullable();
            $table->timestamps();

            $table->unique('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('match_preferences');
    }
};
