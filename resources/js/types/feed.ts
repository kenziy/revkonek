import type { ClubEventType, PostVisibility } from './club';

export type FeedItemType = 'club_post' | 'vehicle_spotlight' | 'event';
export type FeedSource = 'member' | 'followed' | 'discovery' | 'community';

export interface FeedPostData {
    id: number;
    content: string;
    is_announcement: boolean;
    is_pinned: boolean;
    visibility: PostVisibility;
    club: {
        id: number;
        name: string;
        slug: string;
        avatar?: string;
        is_verified: boolean;
        is_premium: boolean;
    };
    user: {
        id: number;
        name: string;
        display_name: string;
        avatar?: string;
    };
    created_at: string;
}

export interface FeedVehicleData {
    id: number;
    uuid: string;
    display_name: string;
    make: string;
    model: string;
    year: number;
    engine_spec?: string;
    category?: string;
    photo?: string;
    likes_count: number;
    owner: {
        id: number;
        uuid: string;
        name: string;
        display_name: string;
        avatar?: string;
    };
}

export interface FeedEventData {
    id: number;
    title: string;
    description?: string;
    type: ClubEventType;
    location_name?: string;
    starts_at: string;
    ends_at?: string;
    rsvps_count: number;
    club: {
        id: number;
        name: string;
        slug: string;
        avatar?: string;
    };
}

export interface FeedItem {
    type: FeedItemType;
    source: FeedSource;
    id: string;
    data: FeedPostData | FeedVehicleData | FeedEventData;
    score: number;
}

export interface FeedResponse {
    items: FeedItem[];
    has_more: boolean;
    next_offset: number;
}

export interface SidebarEvent {
    id: number;
    title: string;
    type: ClubEventType;
    starts_at: string;
    club_name: string;
    club_slug: string;
}

export interface SidebarClub {
    id: number;
    name: string;
    slug: string;
    avatar?: string;
    members_count: number;
}

export function isPostItem(item: FeedItem): item is FeedItem & { data: FeedPostData } {
    return item.type === 'club_post';
}

export function isVehicleItem(item: FeedItem): item is FeedItem & { data: FeedVehicleData } {
    return item.type === 'vehicle_spotlight';
}

export function isEventItem(item: FeedItem): item is FeedItem & { data: FeedEventData } {
    return item.type === 'event';
}
