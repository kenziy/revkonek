export interface User {
    id: number;
    uuid?: string;
    name: string;
    username?: string;
    display_name: string;
    email: string;
    email_verified_at?: string;
    is_premium?: boolean;
    cover_photo?: string;
    avatar?: string;
}

export interface PublicProfileUser {
    uuid: string;
    name: string;
    username?: string;
    display_name: string;
    avatar?: string;
    cover_photo?: string;
    bio?: string;
    city?: string;
    province?: string;
    riding_experience_years?: number;
    riding_style?: string;
    is_premium: boolean;
    member_since: string;
    followers_count: number;
    following_count: number;
}

export interface PublicProfileVehicle {
    uuid: string;
    displayName: string;
    engineSpec?: string;
    make: string;
    model: string;
    year: number;
    color?: string;
    vehicleType?: string;
    category?: string;
    photo?: string;
    modificationLevel?: string;
    likesCount: number;
    isLiked: boolean;
}

export interface FollowUser {
    uuid: string;
    display_name: string;
    username?: string;
    avatar?: string;
    is_premium: boolean;
    isFollowing: boolean;
    isOwn: boolean;
}

export interface PublicProfileClub {
    slug: string;
    name: string;
    avatar?: string;
    type: string;
    is_premium: boolean;
    members_count: number;
    role: string;
}

export interface SubscriptionPlan {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    price: string;
    currency: string;
    billing_period: string;
    features: string[] | null;
    is_active: boolean;
    sort_order: number;
}

export interface UserSubscription {
    id: number;
    user_id: number;
    plan_id: number;
    status: string;
    starts_at: string | null;
    ends_at: string | null;
    trial_ends_at: string | null;
    cancelled_at: string | null;
    grace_period_ends_at: string | null;
    payment_provider: string | null;
    payment_provider_id: string | null;
    receipt_path: string | null;
    amount: string | null;
    original_amount: string | null;
    currency: string;
    coupon_id: number | null;
    verified_by: number | null;
    verified_at: string | null;
    admin_note: string | null;
    rejected_at: string | null;
    plan?: SubscriptionPlan;
    verifier?: {
        id: number;
        name: string;
        username?: string;
    };
    coupon?: SubscriptionCoupon;
    created_at: string;
    updated_at: string;
}

export type SubscriptionStatus = 'pending_verification' | 'active' | 'expired' | 'rejected' | 'cancelled' | 'trialing';
export type CouponDiscountType = 'percentage' | 'fixed';

export interface SubscriptionCoupon {
    id: number;
    code: string;
    description?: string;
    discount_type: CouponDiscountType;
    discount_value: string;
    max_uses?: number;
    times_used: number;
    min_amount?: string;
    starts_at?: string;
    expires_at?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
        is_admin: boolean;
        is_premium: boolean;
        subscription_tier: 'free' | 'premium';
        roles: string[];
        permissions: string[];
    };
    features: {
        sos: boolean;
    };
    flash: {
        success?: string;
        error?: string;
    };
};
