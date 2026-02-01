<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('skill_ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->decimal('rating', 8, 2)->default(1000);
            $table->decimal('uncertainty', 8, 2)->default(350);
            $table->unsignedInteger('challenges_counted')->default(0);
            $table->boolean('is_ranked')->default(false);
            $table->timestamp('last_decay_at')->nullable();
            $table->timestamps();

            $table->unique('user_id');
            $table->index('rating');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('skill_ratings');
    }
};
