<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->uuid('uuid')->nullable()->after('id');
            $table->string('cover_photo')->nullable()->after('email');
        });

        // Backfill existing rows
        DB::table('users')->whereNull('uuid')->orWhere('uuid', '')->orderBy('id')->each(function ($user) {
            DB::table('users')->where('id', $user->id)->update(['uuid' => Str::uuid()->toString()]);
        });

        // Now add unique index
        Schema::table('users', function (Blueprint $table) {
            $table->unique('uuid');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['uuid', 'cover_photo']);
        });
    }
};
