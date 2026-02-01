import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, SearchBar, Badge, EmptyState, Tabs } from '@/Components/UI';
import { useState } from 'react';
import clsx from 'clsx';
import {
    MapPinIcon,
    StarIcon,
    ShoppingBagIcon,
    WrenchScrewdriverIcon,
    BuildingStorefrontIcon,
} from '@heroicons/react/24/outline';

interface Shop {
    id: number;
    name: string;
    photo?: string;
    rating: number;
    reviewCount: number;
    location: string;
    distance: string;
    categories: string[];
    isVerified: boolean;
}

interface Listing {
    id: number;
    title: string;
    photo?: string;
    price: number;
    condition: 'new' | 'used' | 'refurbished';
    seller: {
        name: string;
        avatar?: string;
    };
    location: string;
    postedAt: string;
}

interface ShopIndexProps {
    shops?: Shop[];
    listings?: Listing[];
}

export default function ShopIndex({ shops = [], listings = [] }: ShopIndexProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredShops = shops.filter(
        (shop) =>
            shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            shop.categories.some((cat) =>
                cat.toLowerCase().includes(searchQuery.toLowerCase())
            )
    );

    const filteredListings = listings.filter((listing) =>
        listing.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
        }).format(price);

    return (
        <AuthenticatedLayout header="Shop">
            <Head title="Shop" />

            <div className="space-y-4">
                <SearchBar
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClear={() => setSearchQuery('')}
                    placeholder="Search shops or parts..."
                />

                <Tabs defaultValue="shops">
                    <Tabs.List fullWidth>
                        <Tabs.Trigger value="shops">Shops</Tabs.Trigger>
                        <Tabs.Trigger value="marketplace">Marketplace</Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="shops" className="mt-4">
                        {filteredShops.length > 0 ? (
                            <div className="space-y-3">
                                {filteredShops.map((shop) => (
                                    <Link key={shop.id} href={route('shop.show', shop.id)}>
                                        <Card hoverable>
                                            <div className="flex gap-4">
                                                <div className="flex-shrink-0">
                                                    {shop.photo ? (
                                                        <img
                                                            src={shop.photo}
                                                            alt={shop.name}
                                                            className="w-20 h-20 rounded-xl object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-20 h-20 rounded-xl bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center">
                                                            <BuildingStorefrontIcon className="h-8 w-8 text-secondary-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold text-secondary-900 dark:text-white truncate">
                                                            {shop.name}
                                                        </h3>
                                                        {shop.isVerified && (
                                                            <Badge variant="success" size="sm">
                                                                Verified
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className="flex items-center text-accent-500">
                                                            <StarIcon className="h-4 w-4 fill-current" />
                                                            <span className="ml-1 text-sm font-medium">
                                                                {shop.rating.toFixed(1)}
                                                            </span>
                                                        </div>
                                                        <span className="text-sm text-secondary-400">
                                                            ({shop.reviewCount} reviews)
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                                                        <MapPinIcon className="h-4 w-4" />
                                                        {shop.location} • {shop.distance}
                                                    </div>
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {shop.categories.slice(0, 3).map((category) => (
                                                            <Badge
                                                                key={category}
                                                                variant="secondary"
                                                                size="sm"
                                                            >
                                                                {category}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <EmptyState
                                    icon={<BuildingStorefrontIcon className="h-8 w-8" />}
                                    title="No shops found"
                                    description="Try adjusting your search or check back later"
                                />
                            </Card>
                        )}
                    </Tabs.Content>

                    <Tabs.Content value="marketplace" className="mt-4">
                        {filteredListings.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3">
                                {filteredListings.map((listing) => (
                                    <Link key={listing.id} href={route('shop.listing', listing.id)}>
                                        <Card hoverable padding="none" className="overflow-hidden">
                                            <div className="aspect-square bg-secondary-100 dark:bg-secondary-800 relative">
                                                {listing.photo ? (
                                                    <img
                                                        src={listing.photo}
                                                        alt={listing.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full">
                                                        <WrenchScrewdriverIcon className="h-10 w-10 text-secondary-300 dark:text-secondary-600" />
                                                    </div>
                                                )}
                                                <Badge
                                                    variant={
                                                        listing.condition === 'new'
                                                            ? 'success'
                                                            : listing.condition === 'refurbished'
                                                            ? 'info'
                                                            : 'secondary'
                                                    }
                                                    size="sm"
                                                    className="absolute top-2 left-2"
                                                >
                                                    {listing.condition}
                                                </Badge>
                                            </div>
                                            <div className="p-3">
                                                <h3 className="font-medium text-sm text-secondary-900 dark:text-white line-clamp-2">
                                                    {listing.title}
                                                </h3>
                                                <p className="text-primary-600 dark:text-primary-400 font-bold mt-1">
                                                    {formatPrice(listing.price)}
                                                </p>
                                                <p className="text-xs text-secondary-400 mt-1">
                                                    {listing.location}
                                                </p>
                                            </div>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <EmptyState
                                    icon={<ShoppingBagIcon className="h-8 w-8" />}
                                    title="No listings found"
                                    description="Try adjusting your search or check back later"
                                />
                            </Card>
                        )}
                    </Tabs.Content>
                </Tabs>
            </div>
        </AuthenticatedLayout>
    );
}
