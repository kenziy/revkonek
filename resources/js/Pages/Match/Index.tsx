import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, Avatar, Badge, SearchBar, EmptyState } from '@/Components/UI';
import { useState } from 'react';
import clsx from 'clsx';
import {
    AdjustmentsHorizontalIcon,
    MapPinIcon,
    StarIcon,
    BoltIcon,
} from '@heroicons/react/24/outline';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

interface Rider {
    id: number;
    name: string;
    avatar?: string;
    distance: string;
    bike: string;
    rating: number;
    wins: number;
    lookingForChallenge: boolean;
}

interface MatchIndexProps {
    riders?: Rider[];
}

export default function MatchIndex({ riders = [] }: MatchIndexProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const filteredRiders = riders.filter(
        (rider) =>
            rider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            rider.bike.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AuthenticatedLayout header="Find Riders">
            <Head title="Find Riders" />

            <div className="space-y-4">
                <div className="flex gap-3">
                    <SearchBar
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClear={() => setSearchQuery('')}
                        placeholder="Search riders or bikes..."
                        className="flex-1"
                    />
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={clsx(
                            'flex items-center justify-center w-12 h-12 rounded-xl',
                            'border transition-colors',
                            showFilters
                                ? 'bg-primary-50 border-primary-500 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                                : 'border-secondary-200 dark:border-secondary-700 text-secondary-500 hover:bg-secondary-50 dark:hover:bg-secondary-800'
                        )}
                    >
                        <AdjustmentsHorizontalIcon className="h-5 w-5" />
                    </button>
                </div>

                {showFilters && (
                    <Card className="animate-slide-down">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                    Distance
                                </label>
                                <div className="flex gap-2">
                                    {['5km', '10km', '25km', '50km'].map((distance) => (
                                        <button
                                            key={distance}
                                            className="px-3 py-1.5 text-sm rounded-lg border border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-800"
                                        >
                                            {distance}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                    Bike Class
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {['Scooter', 'Underbone', 'Sport', 'Big Bike'].map((type) => (
                                        <button
                                            key={type}
                                            className="px-3 py-1.5 text-sm rounded-lg border border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-800"
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {filteredRiders.length > 0 ? (
                    <div className="space-y-3">
                        {filteredRiders.map((rider) => (
                            <Card key={rider.id} hoverable>
                                <div className="flex items-start gap-4">
                                    <div className="relative">
                                        <Avatar
                                            src={rider.avatar}
                                            name={rider.name}
                                            size="lg"
                                            status={rider.lookingForChallenge ? 'online' : 'offline'}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-secondary-900 dark:text-white">
                                                {rider.name}
                                            </h3>
                                            {rider.lookingForChallenge && (
                                                <Badge variant="success" size="sm" dot>
                                                    Ready
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                            {rider.bike}
                                        </p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-secondary-400">
                                            <span className="flex items-center gap-1">
                                                <MapPinIcon className="h-3.5 w-3.5" />
                                                {rider.distance}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <StarIcon className="h-3.5 w-3.5 text-accent-500" />
                                                {rider.rating.toFixed(1)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <BoltIcon className="h-3.5 w-3.5" />
                                                {rider.wins} wins
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <PrimaryButton className="text-xs px-3 py-1.5">
                                            Challenge
                                        </PrimaryButton>
                                        <SecondaryButton className="text-xs px-3 py-1.5">
                                            View
                                        </SecondaryButton>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <EmptyState
                            icon="search"
                            title="No riders found"
                            description={
                                searchQuery
                                    ? 'Try adjusting your search or filters'
                                    : 'No riders are currently looking for challenges nearby'
                            }
                        />
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
