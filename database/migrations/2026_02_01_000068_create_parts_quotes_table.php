<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parts_quotes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parts_request_id')->constrained()->cascadeOnDelete();
            $table->foreignId('shop_id')->constrained()->cascadeOnDelete();
            $table->decimal('price', 12, 2);
            $table->string('condition'); // new, used
            $table->text('notes')->nullable();
            $table->string('availability'); // in_stock, can_order, custom
            $table->unsignedSmallInteger('estimated_days')->nullable();
            $table->string('status')->default('pending'); // pending, accepted, rejected
            $table->timestamps();

            $table->unique(['parts_request_id', 'shop_id']);
            $table->index('parts_request_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parts_quotes');
    }
};
