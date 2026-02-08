<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->string('receipt_path')->nullable()->after('payment_provider_id');
            $table->decimal('amount', 10, 2)->nullable()->after('receipt_path');
            $table->decimal('original_amount', 10, 2)->nullable()->after('amount');
            $table->string('currency', 10)->default('PHP')->after('original_amount');
            $table->foreignId('coupon_id')->nullable()->after('currency')
                ->constrained('subscription_coupons')->nullOnDelete();
            $table->foreignId('verified_by')->nullable()->after('coupon_id')
                ->constrained('users')->nullOnDelete();
            $table->timestamp('verified_at')->nullable()->after('verified_by');
            $table->text('admin_note')->nullable()->after('verified_at');
            $table->timestamp('rejected_at')->nullable()->after('admin_note');
        });
    }

    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropForeign(['coupon_id']);
            $table->dropForeign(['verified_by']);
            $table->dropColumn([
                'receipt_path',
                'amount',
                'original_amount',
                'currency',
                'coupon_id',
                'verified_by',
                'verified_at',
                'admin_note',
                'rejected_at',
            ]);
        });
    }
};
