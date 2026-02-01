<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sos_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sos_alert_id')->constrained()->cascadeOnDelete();
            $table->foreignId('responder_id')->constrained('users')->cascadeOnDelete();
            $table->string('status')->default('responding'); // responding, arrived, helped, cancelled
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->unsignedInteger('eta_minutes')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('arrived_at')->nullable();
            $table->timestamps();

            $table->index(['sos_alert_id', 'status']);
            $table->unique(['sos_alert_id', 'responder_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sos_responses');
    }
};
