<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('false_alarm_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('sos_alert_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('count')->default(1);
            $table->timestamp('cooldown_until')->nullable();
            $table->boolean('is_banned')->default(false);
            $table->timestamps();

            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('false_alarm_records');
    }
};
