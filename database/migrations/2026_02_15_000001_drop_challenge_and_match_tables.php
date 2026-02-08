<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        Schema::dropIfExists('challenge_chats');
        Schema::dropIfExists('challenge_witnesses');
        Schema::dropIfExists('challenge_disputes');
        Schema::dropIfExists('challenge_results');
        Schema::dropIfExists('user_challenge_stats');
        Schema::dropIfExists('challenges');
        Schema::dropIfExists('match_history');
        Schema::dropIfExists('match_preferences');
        Schema::dropIfExists('availability_schedules');

        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        if (Schema::hasColumn('users', 'is_looking_for_match')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('is_looking_for_match');
            });
        }

        if (Schema::hasColumn('vehicles', 'is_available_for_match')) {
            Schema::table('vehicles', function (Blueprint $table) {
                $table->dropColumn('is_available_for_match');
            });
        }
    }

    public function down(): void
    {
        // Not reversible — these features have been removed
    }
};
