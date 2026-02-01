<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('challenges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('challenger_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('challenged_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('challenger_bike_id')->nullable()->constrained('bikes')->nullOnDelete();
            $table->foreignId('challenged_bike_id')->nullable()->constrained('bikes')->nullOnDelete();
            $table->string('type'); // time_trial, meet_and_cruise, track_day
            $table->string('status')->default('pending');
            $table->string('location_name')->nullable();
            $table->decimal('location_lat', 10, 8)->nullable();
            $table->decimal('location_lng', 11, 8)->nullable();
            $table->timestamp('proposed_at')->nullable();
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->boolean('challenger_confirmed')->default(false);
            $table->boolean('challenged_confirmed')->default(false);
            $table->boolean('disclaimer_accepted_challenger')->default(false);
            $table->boolean('disclaimer_accepted_challenged')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['challenger_id', 'status']);
            $table->index(['challenged_id', 'status']);
            $table->index('status');
            $table->index('scheduled_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('challenges');
    }
};
