<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('onboarding_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('riding_experience_years');
            $table->string('self_assessed_skill'); // beginner, intermediate, advanced, expert
            $table->boolean('has_track_experience')->default(false);
            $table->boolean('has_race_history')->default(false);
            $table->string('license_type')->nullable();
            $table->string('club_membership')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->timestamps();

            $table->unique('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('onboarding_responses');
    }
};
