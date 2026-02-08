export interface AdminStats {
    totalUsers: number;
    activeUsers: number;
    newUsersToday: number;
    newUsersThisWeek: number;
    totalClubs: number;
    activeClubs: number;
    totalShops: number;
    pendingShopVerifications: number;
    totalSubscriptions: number;
}

export interface AdminUser {
    id: number;
    name: string;
    username?: string;
    email: string;
    display_name: string;
    is_active: boolean;
    is_premium: boolean;
    email_verified_at?: string;
    created_at: string;
    clubs_count?: number;
    vehicles_count?: number;
}

export interface SubscriptionPlan {
    id: number;
    name: string;
    slug: string;
    description?: string;
    price: number;
    currency: string;
    billing_period: 'monthly' | 'yearly';
    features?: string[];
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface AuditLog {
    id: number;
    user_id?: number;
    user_name?: string;
    user_email?: string;
    action: string;
    auditable_type?: string;
    auditable_id?: number;
    old_values?: string;
    new_values?: string;
    ip_address?: string;
    user_agent?: string;
    created_at: string;
}

export interface StaffMember {
    id: number;
    name: string;
    email: string;
    display_name: string;
    roles: string[];
    created_at: string;
}

export interface AdminShop {
    id: number;
    name: string;
    slug: string;
    description?: string;
    city: string;
    province: string;
    verification_status: string;
    is_active: boolean;
    owner_name?: string;
    owner_email?: string;
    average_rating: number;
    total_reviews: number;
    created_at: string;
}

export interface AdminSubscription {
    id: number;
    user_id: number;
    user_name?: string;
    user_email?: string;
    plan_name?: string;
    status: string;
    starts_at: string;
    ends_at?: string;
    receipt_path?: string;
    amount?: string;
    original_amount?: string;
    currency?: string;
    coupon_id?: number;
    verified_by?: number;
    verified_at?: string;
    admin_note?: string;
    rejected_at?: string;
    created_at: string;
}

export interface AdminSubscriptionStats {
    totalActive: number;
    totalCancelled: number;
    totalExpired: number;
    totalTrialing: number;
    totalPending: number;
    totalRejected: number;
    totalRevenue: number;
}

export interface AdminContentItem {
    id: number;
    content: string;
    is_announcement: boolean;
    visibility: string;
    user_name?: string;
    club_name?: string;
    created_at: string;
}

export interface SystemSetting {
    id: number;
    group: string;
    key: string;
    value?: string;
    type: string;
    description?: string;
}

export interface AdminClubSubscriptionStats {
    pending: number;
    active: number;
    expired: number;
    rejected: number;
    totalRevenue: number;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}
