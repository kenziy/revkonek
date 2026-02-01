<?php

namespace App\Enums;

enum ShopVerificationStatus: string
{
    case PENDING = 'pending';
    case UNDER_REVIEW = 'under_review';
    case VERIFIED = 'verified';
    case REJECTED = 'rejected';
    case EXPIRED = 'expired';
}
