<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sos_alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type'); // accident, breakdown, medical, theft, other
            $table->string('status')->default('active'); // active, responding, resolved, cancelled, false_alarm
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->unsignedInteger('accuracy_meters')->nullable();
            $table->string('location_description')->nullable();
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('current_tier')->default(1);
            $table->timestamp('escalated_at')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->string('resolution_notes')->nullable();
            $table->boolean('is_test')->default(false);
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['status', 'created_at']);
            $table->index(['latitude', 'longitude']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sos_alerts');
    }
};
