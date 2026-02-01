<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notification_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->boolean('challenge_invites')->default(true);
            $table->boolean('challenge_updates')->default(true);
            $table->boolean('group_activity')->default(true);
            $table->boolean('sos_alerts')->default(true); // Cannot be disabled in app
            $table->boolean('messages')->default(true);
            $table->boolean('match_suggestions')->default(true);
            $table->boolean('shop_promotions')->default(false);
            $table->boolean('system_announcements')->default(true);
            $table->boolean('email_digest')->default(true);
            $table->string('email_digest_frequency')->default('daily'); // daily, weekly
            $table->time('dnd_start')->nullable();
            $table->time('dnd_end')->nullable();
            $table->timestamps();

            $table->unique('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notification_preferences');
    }
};
