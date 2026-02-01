<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shop_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shop_id')->constrained()->cascadeOnDelete();
            $table->foreignId('verification_id')->nullable()->constrained('shop_verifications')->nullOnDelete();
            $table->string('type'); // business_permit, government_id, dti_registration, bir_certificate
            $table->string('file_path');
            $table->string('original_filename');
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['shop_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shop_documents');
    }
};
