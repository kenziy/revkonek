<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sos_escalation_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sos_alert_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('from_tier');
            $table->unsignedSmallInteger('to_tier');
            $table->string('action_taken');
            $table->unsignedInteger('users_notified')->default(0);
            $table->timestamps();

            $table->index('sos_alert_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sos_escalation_logs');
    }
};
