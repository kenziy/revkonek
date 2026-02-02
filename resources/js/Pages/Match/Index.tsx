import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import { Card, Badge, SearchBar, EmptyState } from '@/Components/UI';
import Switch from '@/Components/Form/Switch';
import { useState } from 'react';
import clsx from 'clsx';
import {
    AdjustmentsHorizontalIcon,
    MapPinIcon,
    StarIcon,
    BoltIcon,
    TruckIcon,
} from '@heroicons/react/24/outline';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import type { MatchVehicle, MyVehicle, VehicleType } from '@/types/vehicle';

interface MatchIndexProps {
    vehicles?: MatchVehicle[];
    allVehicles?: MatchVehicle[];
    myVehicles?: MyVehicle[];
    vehicleTypes?: VehicleType[];
    isLookingForMatch?: boolean;
}

export default function MatchIndex({
    vehicles = [],
    allVehicles = [],
    myVehicles = [],
    vehicleTypes = [],
    isLookingForMatch = false
}: MatchIndexProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedVehicleType, setSelectedVehicleType] = useState<string | null>(null);
    const [isToggling, setIsToggling] = useState<number | null>(null);

    const filteredVehicles = vehicles.filter((vehicle) => {
        const matchesSearch =
            vehicle.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vehicle.owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vehicle.category?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = !selectedVehicleType || vehicle.vehicleType === selectedVehicleType;

        return matchesSearch && matchesType;
    });

    // If no filtered vehicles found, show all available vehicles (also filtered)
    const filteredAllVehicles = allVehicles.filter((vehicle) => {
        const matchesSearch =
            vehicle.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vehicle.owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vehicle.category?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = !selectedVehicleType || vehicle.vehicleType === selectedVehicleType;

        return matchesSearch && matchesType;
    });

    const displayVehicles = filteredVehicles.length > 0 ? filteredVehicles : filteredAllVehicles;
    const showingAllVehicles = filteredVehicles.length === 0 && filteredAllVehicles.length > 0 && !searchQuery;

    const handleToggleVehicleStatus = (vehicleId: number) => {
        setIsToggling(vehicleId);
        router.post(route('match.toggleVehicleStatus', vehicleId), {}, {
            preserveScroll: true,
            onFinish: () => setIsToggling(null),
        });
    };

    return (
        <AuthenticatedLayout header="Find Riders">
            <Head title="Find Riders" />

            <div className="space-y-4">
                {/* My Vehicles Section */}
                {myVehicles.length > 0 && (
                    <Card>
                        <h3 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
                            My Vehicles
                        </h3>
                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {myVehicles.map((vehicle) => (
                                <div
                                    key={vehicle.id}
                                    className={clsx(
                                        'flex-shrink-0 p-3 rounded-xl border-2 min-w-[160px] transition-colors',
                                        vehicle.isAvailableForMatch
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                            : 'border-secondary-200 dark:border-secondary-700'
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {vehicle.photo ? (
                                                <img
                                                    src={vehicle.photo}
                                                    alt={vehicle.displayName}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <TruckIcon className="h-6 w-6 text-secondary-400" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-sm text-secondary-900 dark:text-white truncate">
                                                {vehicle.displayName}
                                            </p>
                                            <p className="text-xs text-secondary-500 dark:text-secondary-400">
                                                {vehicle.engineSpec}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleToggleVehicleStatus(vehicle.id)}
                                        disabled={isToggling === vehicle.id}
                                        className={clsx(
                                            'mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-medium transition-colors',
                                            vehicle.isAvailableForMatch
                                                ? 'bg-primary-600 text-white hover:bg-primary-700'
                                                : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-700'
                                        )}
                                    >
                                        {isToggling === vehicle.id
                                            ? '...'
                                            : vehicle.isAvailableForMatch
                                              ? 'Available'
                                              : 'Not Available'}
                                    </button>
                                </div>
                            ))}
                        </div>
                        {myVehicles.length === 0 && (
                            <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                <Link href={route('vehicles.create')} className="text-primary-600 hover:text-primary-500">
                                    Add a vehicle
                                </Link>{' '}
                                to start matching with other riders.
                            </p>
                        )}
                    </Card>
                )}

                <div className="flex gap-3">
                    <SearchBar
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClear={() => setSearchQuery('')}
                        placeholder="Search vehicles or riders..."
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
                                    Vehicle Type
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    <button
                                        onClick={() => setSelectedVehicleType(null)}
                                        className={clsx(
                                            'px-3 py-1.5 text-sm rounded-lg border transition-colors',
                                            !selectedVehicleType
                                                ? 'border-primary-500 bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                                                : 'border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-800'
                                        )}
                                    >
                                        All
                                    </button>
                                    {vehicleTypes.map((type) => (
                                        <button
                                            key={type.slug}
                                            onClick={() => setSelectedVehicleType(type.slug)}
                                            className={clsx(
                                                'px-3 py-1.5 text-sm rounded-lg border transition-colors',
                                                selectedVehicleType === type.slug
                                                    ? 'border-primary-500 bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                                                    : 'border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-800'
                                            )}
                                        >
                                            {type.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {showingAllVehicles && (
                    <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-3 text-sm text-primary-700 dark:text-primary-300">
                        No vehicles currently available for match. Showing all vehicles.
                    </div>
                )}

                {displayVehicles.length > 0 ? (
                    <div className="space-y-3">
                        {displayVehicles.map((vehicle) => (
                            <Card key={vehicle.id} hoverable>
                                <div className="flex gap-4">
                                    {/* Vehicle Photo */}
                                    <div className="w-24 h-24 sm:w-32 sm:h-24 rounded-xl bg-secondary-100 dark:bg-secondary-800 flex-shrink-0 overflow-hidden relative">
                                        {vehicle.photo ? (
                                            <img
                                                src={vehicle.photo}
                                                alt={vehicle.displayName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <TruckIcon className="h-10 w-10 text-secondary-300 dark:text-secondary-600" />
                                            </div>
                                        )}
                                        <Badge
                                            variant={vehicle.vehicleType === 'bike' ? 'primary' : 'info'}
                                            size="sm"
                                            className="absolute top-1 left-1"
                                        >
                                            {vehicle.vehicleTypeName}
                                        </Badge>
                                    </div>

                                    {/* Vehicle & Owner Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h3 className="font-semibold text-secondary-900 dark:text-white">
                                                    {vehicle.displayName}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-secondary-500 dark:text-secondary-400">
                                                    {vehicle.engineSpec && <span>{vehicle.engineSpec}</span>}
                                                    {vehicle.category && (
                                                        <>
                                                            <span>&bull;</span>
                                                            <span>{vehicle.category}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            {vehicle.isAvailableForMatch && (
                                                <Badge variant="success" size="sm" dot>
                                                    Ready
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="mt-3 pt-3 border-t border-secondary-100 dark:border-secondary-700">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-secondary-600 dark:text-secondary-300">
                                                        {vehicle.owner.name}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-1 text-xs text-secondary-400">
                                                        <span className="flex items-center gap-1">
                                                            <MapPinIcon className="h-3.5 w-3.5" />
                                                            {vehicle.distance}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <StarIcon className="h-3.5 w-3.5 text-accent-500" />
                                                            {vehicle.owner.rating.toFixed(1)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <BoltIcon className="h-3.5 w-3.5" />
                                                            {vehicle.owner.wins} wins
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <PrimaryButton className="text-xs px-3 py-1.5">
                                                        Challenge
                                                    </PrimaryButton>
                                                    <Link href={route('vehicles.show', vehicle.id)}>
                                                        <SecondaryButton className="text-xs px-3 py-1.5">
                                                            View
                                                        </SecondaryButton>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <EmptyState
                            icon="search"
                            title="No vehicles found"
                            description={
                                searchQuery
                                    ? 'Try adjusting your search or filters'
                                    : 'No vehicles are currently available for matching'
                            }
                        />
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
