<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clubs', function (Blueprint $table) {
            $table->string('theme_color', 7)->nullable()->after('is_premium');
            $table->boolean('is_verified')->default(false)->after('theme_color');
        });

        Schema::table('club_posts', function (Blueprint $table) {
            $table->string('visibility')->default('public')->after('is_pinned');
        });

        Schema::table('club_events', function (Blueprint $table) {
            $table->string('type')->default('meetup')->after('club_id');
            $table->string('route_link', 500)->nullable()->after('max_attendees');
        });
    }

    public function down(): void
    {
        Schema::table('clubs', function (Blueprint $table) {
            $table->dropColumn(['theme_color', 'is_verified']);
        });

        Schema::table('club_posts', function (Blueprint $table) {
            $table->dropColumn('visibility');
        });

        Schema::table('club_events', function (Blueprint $table) {
            $table->dropColumn(['type', 'route_link']);
        });
    }
};
