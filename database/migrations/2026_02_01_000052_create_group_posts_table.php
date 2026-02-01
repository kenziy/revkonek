<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('group_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->text('content');
            $table->boolean('is_announcement')->default(false);
            $table->boolean('is_pinned')->default(false);
            $table->timestamps();

            $table->index(['group_id', 'created_at']);
            $table->index(['group_id', 'is_pinned']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('group_posts');
    }
};
