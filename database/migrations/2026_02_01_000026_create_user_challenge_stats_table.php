<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_challenge_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('total_challenges')->default(0);
            $table->unsignedInteger('wins')->default(0);
            $table->unsignedInteger('losses')->default(0);
            $table->unsignedInteger('draws')->default(0);
            $table->decimal('skill_rating', 8, 2)->default(1000);
            $table->decimal('skill_uncertainty', 8, 2)->default(350);
            $table->string('rank')->default('unranked');
            $table->unsignedInteger('current_streak')->default(0);
            $table->unsignedInteger('best_streak')->default(0);
            $table->unsignedInteger('disputes_filed')->default(0);
            $table->unsignedInteger('disputes_won')->default(0);
            $table->unsignedInteger('false_disputes')->default(0);
            $table->timestamp('last_challenge_at')->nullable();
            $table->timestamps();

            $table->unique('user_id');
            $table->index('skill_rating');
            $table->index('rank');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_challenge_stats');
    }
};
