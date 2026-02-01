<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bikes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('make'); // Honda, Yamaha, Kawasaki, etc.
            $table->string('model');
            $table->unsignedSmallInteger('year');
            $table->unsignedSmallInteger('cc'); // Engine displacement
            $table->string('category'); // sport, naked, cruiser, etc.
            $table->string('modification_level')->default('stock'); // stock, mild, built
            $table->string('color')->nullable();
            $table->string('plate_number')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(false);
            $table->timestamps();

            $table->index('user_id');
            $table->index(['user_id', 'is_active']);
            $table->index('category');
            $table->index('cc');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bikes');
    }
};
