<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_connections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('connected_user_id')->constrained('users')->cascadeOnDelete();
            $table->string('status')->default('pending'); // pending, accepted, rejected
            $table->timestamp('connected_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'connected_user_id']);
            $table->index(['user_id', 'status']);
            $table->index(['connected_user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_connections');
    }
};
