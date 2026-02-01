<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_privacy_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('profile_visibility')->default('public'); // public, connections_only, hidden
            $table->string('online_status')->default('show'); // show, connections_only, hide
            $table->string('location_sharing')->default('city_level'); // precise, city_level, hidden
            $table->string('garage_visibility')->default('public'); // public, connections_only, private
            $table->boolean('incognito_mode')->default(false);
            $table->boolean('receive_sos_alerts')->default(true);
            $table->timestamps();

            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_privacy_settings');
    }
};
