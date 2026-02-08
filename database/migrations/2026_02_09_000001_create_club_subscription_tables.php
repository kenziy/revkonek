<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('club_subscription_settings', function (Blueprint $table) {
            $table->id();
            $table->decimal('yearly_price', 10, 2);
            $table->string('currency')->default('PHP');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('club_subscription_coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->string('discount_type'); // percentage, fixed
            $table->decimal('discount_value', 10, 2);
            $table->unsignedInteger('max_uses')->nullable();
            $table->unsignedInteger('times_used')->default(0);
            $table->decimal('min_amount', 10, 2)->nullable();
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('club_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('club_id')->constrained('clubs')->cascadeOnDelete();
            $table->foreignId('requested_by')->constrained('users');
            $table->string('status'); // pending_verification, active, expired, rejected, cancelled
            $table->decimal('amount', 10, 2);
            $table->decimal('original_amount', 10, 2);
            $table->string('currency')->default('PHP');
            $table->foreignId('coupon_id')->nullable()->constrained('club_subscription_coupons')->nullOnDelete();
            $table->string('receipt_path');
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('verified_at')->nullable();
            $table->text('admin_note')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->timestamps();

            $table->index(['club_id', 'status']);
            $table->index('status');
            $table->index('ends_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('club_subscriptions');
        Schema::dropIfExists('club_subscription_coupons');
        Schema::dropIfExists('club_subscription_settings');
    }
};
