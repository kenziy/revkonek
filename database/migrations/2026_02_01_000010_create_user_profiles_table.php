<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('avatar')->nullable();
            $table->text('bio')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('country')->default('Philippines');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->unsignedSmallInteger('riding_experience_years')->default(0);
            $table->string('riding_style')->nullable(); // casual, sport, touring, adventure
            $table->boolean('is_looking_for_challenge')->default(false);
            $table->boolean('is_online')->default(false);
            $table->timestamp('last_seen_at')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index(['latitude', 'longitude']);
            $table->index('is_looking_for_challenge');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
    }
};
