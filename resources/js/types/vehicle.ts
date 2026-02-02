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

export interface Vehicle {
    id: number;
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
    isAvailableForMatch: boolean;
    photo?: string;
    photos?: VehiclePhoto[];
    bikeDetails?: BikeDetails;
    carDetails?: CarDetails;
    owner?: {
        id: number;
        name: string;
    };
}

export interface VehiclePhoto {
    id: number;
    url: string;
    isPrimary: boolean;
}

export interface VehicleForEdit {
    id: number;
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
    isAvailableForMatch: boolean;
    photo?: string;
    cc?: number;
    engineLiters?: number;
    horsepower?: number;
    transmission?: string;
    drivetrain?: string;
    doors?: number;
}

export interface MatchVehicle {
    id: number;
    vehicleType: string;
    vehicleTypeName: string;
    displayName: string;
    category?: string;
    categorySlug?: string;
    engineSpec?: string;
    modificationLevel?: string;
    isAvailableForMatch: boolean;
    photo?: string;
    owner: {
        id: number;
        name: string;
        rating: number;
        wins: number;
    };
    distance: string;
}

export interface MyVehicle {
    id: number;
    displayName: string;
    vehicleType: string;
    engineSpec?: string;
    isAvailableForMatch: boolean;
    photo?: string;
}
