<?php

namespace App\Enums;

enum CouponDiscountType: string
{
    case PERCENTAGE = 'percentage';
    case FIXED = 'fixed';
}
