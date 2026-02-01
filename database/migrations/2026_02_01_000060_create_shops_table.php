<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shops', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('logo')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('address');
            $table->string('city');
            $table->string('province');
            $table->string('postal_code')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->json('business_hours')->nullable();
            $table->json('services')->nullable(); // parts, repairs, customization, etc.
            $table->string('verification_status')->default('pending');
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('verification_expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->decimal('average_rating', 3, 2)->default(0);
            $table->unsignedInteger('total_reviews')->default(0);
            $table->decimal('response_rate', 5, 2)->default(0);
            $table->unsignedInteger('avg_response_time_minutes')->nullable();
            $table->timestamps();

            $table->index('slug');
            $table->index(['latitude', 'longitude']);
            $table->index('verification_status');
            $table->index(['city', 'province']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shops');
    }
};
