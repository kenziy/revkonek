export type ClubType = 'public' | 'private' | 'secret';
export type ClubRole = 'president' | 'vice_president' | 'secretary' | 'treasurer' | 'road_captain' | 'moderator' | 'member';

export const CLUB_ROLE_LABELS: Record<ClubRole, string> = {
    president: 'President',
    vice_president: 'Vice President',
    secretary: 'Secretary',
    treasurer: 'Treasurer',
    road_captain: 'Road Captain',
    moderator: 'Moderator',
    member: 'Member',
};

export const CLUB_ROLE_RANKS: Record<ClubRole, number> = {
    president: 1,
    vice_president: 2,
    secretary: 3,
    treasurer: 3,
    road_captain: 3,
    moderator: 4,
    member: 5,
};

export const CLUB_ROLE_COLORS: Record<ClubRole, 'primary' | 'warning' | 'success' | 'info' | 'secondary' | 'danger'> = {
    president: 'danger',
    vice_president: 'primary',
    secretary: 'success',
    treasurer: 'warning',
    road_captain: 'info',
    moderator: 'warning',
    member: 'secondary',
};
export type ClubTier = 'free' | 'pro';
export type ClubEventType = 'ride' | 'meetup' | 'track_day' | 'workshop';
export type PostVisibility = 'public' | 'members_only';
export type InviteStatus = 'pending' | 'accepted' | 'declined' | 'expired';
export type JoinRequestStatus = 'pending' | 'approved' | 'rejected';
export type RsvpStatus = 'going' | 'maybe' | 'not_going';

export interface Club {
    id: number;
    owner_id: number;
    name: string;
    slug: string;
    description?: string;
    avatar?: string;
    cover_image?: string;
    type: ClubType;
    requires_approval: boolean;
    city?: string;
    province?: string;
    is_premium: boolean;
    is_active: boolean;
    is_archived: boolean;
    theme_color?: string;
    is_verified: boolean;
    last_activity_at?: string;
    members_count?: number;
    followers_count?: number;
    owner?: {
        id: number;
        name: string;
        display_name: string;
        avatar?: string;
    };
    created_at: string;
    updated_at: string;
}

export interface ClubMember {
    id: number;
    club_id: number;
    user_id: number;
    role: ClubRole;
    joined_at?: string;
    is_muted: boolean;
    muted_until?: string;
    points?: number;
    user?: {
        id: number;
        uuid?: string;
        name: string;
        display_name: string;
        avatar?: string;
    };
}

export interface ClubPost {
    id: number;
    club_id: number;
    user_id: number;
    content: string;
    is_announcement: boolean;
    is_pinned: boolean;
    visibility: PostVisibility;
    user?: {
        id: number;
        name: string;
        display_name: string;
        avatar?: string;
    };
    created_at: string;
    updated_at: string;
}

export interface ClubEvent {
    id: number;
    club_id: number;
    type: ClubEventType;
    created_by: number;
    title: string;
    description?: string;
    location_name?: string;
    latitude?: number;
    longitude?: number;
    starts_at: string;
    ends_at?: string;
    max_attendees?: number;
    route_link?: string;
    is_cancelled: boolean;
    rsvps_count?: number;
    creator?: {
        id: number;
        name: string;
        display_name: string;
    };
    rsvps?: ClubEventRsvp[];
    created_at: string;
}

export interface ClubEventRsvp {
    id: number;
    club_event_id: number;
    user_id: number;
    status: RsvpStatus;
    user?: {
        id: number;
        name: string;
        display_name: string;
        avatar?: string;
    };
}

export interface ClubEventAttendance {
    id: number;
    club_event_id: number;
    user_id: number;
    marked_by: number;
    created_at: string;
}

export interface ClubInvite {
    id: number;
    club_id: number;
    invited_by: number;
    user_id?: number;
    email?: string;
    token: string;
    status: InviteStatus;
    expires_at: string;
}

export interface ClubJoinRequest {
    id: number;
    club_id: number;
    user_id: number;
    message?: string;
    status: JoinRequestStatus;
    reviewed_by?: number;
    reviewed_at?: string;
    user?: {
        id: number;
        name: string;
        display_name: string;
        avatar?: string;
    };
    created_at: string;
}

export interface ClubPhoto {
    id: number;
    club_id: number;
    user_id: number;
    path: string;
    caption?: string;
    sort_order: number;
    user?: {
        id: number;
        name: string;
        display_name: string;
        avatar?: string;
    };
    created_at: string;
    updated_at: string;
}

export type ClubSubscriptionStatus = 'pending_verification' | 'active' | 'expired' | 'rejected' | 'cancelled';
export type CouponDiscountType = 'percentage' | 'fixed';

export interface ClubSubscriptionSetting {
    id: number;
    yearly_price: string;
    currency: string;
    description?: string;
    is_active: boolean;
}

export interface ClubSubscription {
    id: number;
    club_id: number;
    requested_by: number;
    status: ClubSubscriptionStatus;
    amount: string;
    original_amount: string;
    currency: string;
    coupon_id?: number;
    receipt_path: string;
    starts_at?: string;
    ends_at?: string;
    verified_by?: number;
    verified_at?: string;
    admin_note?: string;
    rejected_at?: string;
    created_at: string;
    updated_at: string;
    club?: Club;
    requester?: {
        id: number;
        name: string;
        username: string;
        email?: string;
    };
    verifier?: {
        id: number;
        name: string;
        username: string;
    };
    coupon?: ClubSubscriptionCoupon;
}

export interface ClubSubscriptionCoupon {
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

export interface ClubGarageVehicle {
    id: number;
    display_name: string;
    engine_spec?: string;
    year: number;
    make: string;
    model: string;
    modification_level?: string;
    color?: string;
    vehicle_type?: { id: number; slug: string; name: string };
    category?: { id: number; slug: string; name: string };
    bike_details?: { cc: number };
    primary_photo?: { path: string };
    user?: { id: number; name: string; username?: string };
}

export interface ClubGarageStats {
    totalVehicles: number;
    totalCC: number;
    avgCC: number;
    topCategory?: string;
    categoryBreakdown: Record<string, number>;
}

export interface ClubTierLimits {
    maxMembers: number;
    maxVicePresidents: number;
    maxOfficers: number;
    ridesPerMonth: number;
    pinnedPosts: number;
    hasChat: boolean;
    hasCoverImage: boolean;
    hasCustomTheme: boolean;
    hasAnalytics: boolean;
    hasDiscoverPriority: boolean;
    hasVerifiedBadge: boolean;
    hasMembersOnlyPosts: boolean;
    hasEventManagement: boolean;
}
