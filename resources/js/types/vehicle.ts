export interface VehicleType {
    id: number;
    slug: 'bike' | 'car';
    name: string;
    icon?: string;
    categories?: VehicleCategory[];
}

export interface VehicleCategory {
    id: number;
    slug: string;
    name: string;
}

export interface BikeDetails {
    cc: number;
}

export interface CarDetails {
    engineLiters?: number;
    horsepower?: number;
    transmission?: string;
    transmissionLabel?: string;
    drivetrain?: string;
    drivetrainLabel?: string;
    doors?: number;
}

export type VehicleLayoutTemplate = 'classic' | 'showcase' | 'spec_sheet';
export type BackgroundStyle = 'default' | 'gradient' | 'dark' | 'light';
export type ModCategory = 'engine' | 'suspension' | 'exhaust' | 'brakes' | 'cosmetic' | 'wheels' | 'electronics' | 'other';
export type SocialPlatform = 'youtube' | 'instagram' | 'tiktok' | 'facebook' | 'twitter' | 'website';

export interface VehicleMod {
    id: number;
    category: ModCategory;
    categoryLabel: string;
    name: string;
    brand?: string;
    description?: string;
    price?: string;
    currency: string;
    installedAt?: string;
}

export interface VehicleSocialLink {
    id: number;
    platform: SocialPlatform;
    platformLabel: string;
    url: string;
    label?: string;
}

export interface Vehicle {
    id: number;
    uuid: string;
    vehicleType: {
        slug: 'bike' | 'car';
        name: string;
    };
    category?: {
        slug: string;
        name: string;
    };
    make: string;
    model: string;
    year: number;
    displayName: string;
    engineSpec?: string;
    modificationLevel?: string;
    color?: string;
    plateNumber?: string;
    notes?: string;
    isActive: boolean;
    photo?: string;
    photos?: VehiclePhoto[];
    bikeDetails?: BikeDetails;
    carDetails?: CarDetails;
    owner?: {
        id: number;
        uuid: string;
        name: string;
        displayName: string;
        username?: string;
        avatar?: string;
        isPremium: boolean;
    };
    ownerIsPremium?: boolean;
    // Pro fields
    story?: string;
    layoutTemplate?: VehicleLayoutTemplate;
    accentColor?: string;
    backgroundStyle?: BackgroundStyle;
    coverImage?: string;
    youtubeVideoId?: string;
    youtubeAutoplay?: boolean;
    mods?: VehicleMod[];
    socialLinks?: VehicleSocialLink[];
    likesCount?: number;
    isLiked?: boolean;
}

export interface VehiclePhoto {
    id: number;
    url: string;
    isPrimary: boolean;
}

export interface VehicleForEdit {
    id: number;
    uuid: string;
    vehicleTypeId: number;
    vehicleCategoryId?: number;
    vehicleType: {
        slug: 'bike' | 'car';
        name: string;
    };
    make: string;
    model: string;
    year: number;
    modificationLevel: string;
    color?: string;
    plateNumber?: string;
    notes?: string;
    isActive: boolean;
    photo?: string;
    photos?: VehiclePhoto[];
    cc?: number;
    engineLiters?: number;
    horsepower?: number;
    transmission?: string;
    drivetrain?: string;
    doors?: number;
    // Pro fields
    layoutTemplate?: VehicleLayoutTemplate;
    accentColor?: string;
    backgroundStyle?: BackgroundStyle;
    story?: string;
    coverImage?: string;
    youtubeUrl?: string;
    youtubeAutoplay?: boolean;
    mods?: VehicleMod[];
    socialLinks?: VehicleSocialLink[];
}

