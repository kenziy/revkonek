<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('challenge_disputes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('challenge_id')->constrained()->cascadeOnDelete();
            $table->foreignId('filed_by')->constrained('users')->cascadeOnDelete();
            $table->string('reason');
            $table->text('description');
            $table->string('status')->default('pending'); // pending, under_review, resolved, rejected
            $table->foreignId('resolved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('resolution')->nullable();
            $table->text('resolution_notes')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();

            $table->index(['challenge_id', 'status']);
            $table->index('filed_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('challenge_disputes');
    }
};
