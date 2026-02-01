<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('match_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('matched_user_id')->constrained('users')->cascadeOnDelete();
            $table->decimal('match_score', 5, 4);
            $table->string('quality_tier'); // excellent, good, fair
            $table->string('action_taken')->nullable(); // challenged, dismissed, ignored
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('match_history');
    }
};
