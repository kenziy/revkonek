<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shop_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('listing_categories')->cascadeOnDelete();
            $table->string('title');
            $table->string('slug');
            $table->text('description');
            $table->decimal('price', 12, 2);
            $table->decimal('original_price', 12, 2)->nullable();
            $table->string('condition')->nullable(); // new, like_new, good, fair, poor
            $table->string('brand')->nullable();
            $table->json('compatible_bikes')->nullable();
            $table->unsignedInteger('quantity')->default(1);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->timestamp('featured_until')->nullable();
            $table->unsignedInteger('views_count')->default(0);
            $table->unsignedInteger('inquiries_count')->default(0);
            $table->timestamps();

            $table->unique(['shop_id', 'slug']);
            $table->index(['category_id', 'is_active']);
            $table->index('is_featured');
            $table->index('price');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
