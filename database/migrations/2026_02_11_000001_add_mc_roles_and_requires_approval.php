<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clubs', function (Blueprint $table) {
            $table->boolean('requires_approval')->default(false)->after('type');
        });

        // Migrate existing admin roles to president
        DB::table('club_members')
            ->where('role', 'admin')
            ->update(['role' => 'president']);
    }

    public function down(): void
    {
        // Revert president back to admin
        DB::table('club_members')
            ->where('role', 'president')
            ->update(['role' => 'admin']);

        // Revert new roles back to member
        DB::table('club_members')
            ->whereIn('role', ['vice_president', 'secretary', 'treasurer', 'road_captain'])
            ->update(['role' => 'member']);

        Schema::table('clubs', function (Blueprint $table) {
            $table->dropColumn('requires_approval');
        });
    }
};
