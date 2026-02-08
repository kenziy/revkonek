<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->string('layout_template')->default('classic')->after('legacy_bike_id');
            $table->string('accent_color')->nullable()->after('layout_template');
            $table->string('background_style')->default('default')->after('accent_color');
            $table->text('story')->nullable()->after('background_style');
            $table->string('cover_image_path')->nullable()->after('story');
            $table->string('youtube_url')->nullable()->after('cover_image_path');
            $table->string('youtube_video_id')->nullable()->after('youtube_url');
            $table->boolean('youtube_autoplay')->default(false)->after('youtube_video_id');
        });
    }

    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropColumn([
                'layout_template',
                'accent_color',
                'background_style',
                'story',
                'cover_image_path',
                'youtube_url',
                'youtube_video_id',
                'youtube_autoplay',
            ]);
        });
    }
};
