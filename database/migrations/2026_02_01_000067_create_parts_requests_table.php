<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parts_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('listing_categories')->nullOnDelete();
            $table->string('title');
            $table->text('description');
            $table->string('bike_make')->nullable();
            $table->string('bike_model')->nullable();
            $table->unsignedSmallInteger('bike_year')->nullable();
            $table->string('part_number')->nullable();
            $table->string('condition_preference')->nullable(); // new, used, any
            $table->decimal('max_budget', 12, 2)->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('status')->default('active'); // active, fulfilled, expired, cancelled
            $table->timestamp('expires_at');
            $table->timestamps();

            $table->index(['status', 'created_at']);
            $table->index('category_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parts_requests');
    }
};
