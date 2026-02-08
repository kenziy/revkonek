import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, Badge, EmptyState, FloatingActionButton, ProBadge } from '@/Components/UI';
import { PlusIcon, TruckIcon, StarIcon } from '@heroicons/react/24/outline';
import { usePage } from '@inertiajs/react';
import type { Vehicle } from '@/types/vehicle';

interface VehiclesIndexProps {
    vehicles?: Vehicle[];
}

export default function VehiclesIndex({ vehicles = [] }: VehiclesIndexProps) {
    const { auth } = usePage().props as any;
    const isPremium = auth?.is_premium;

    return (
        <AuthenticatedLayout header="My Vehicles">
            <Head title="Vehicles" />

            <div className="space-y-6">
                {vehicles.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {vehicles.map((vehicle) => (
                            <Link key={vehicle.id} href={route('vehicles.show', vehicle.uuid)}>
                                <Card hoverable padding="none" className="overflow-hidden">
                                    <div className="aspect-video bg-secondary-100 dark:bg-secondary-800 relative">
                                        {vehicle.photo ? (
                                            <img
                                                src={vehicle.photo}
                                                alt={vehicle.displayName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <TruckIcon className="h-12 w-12 text-secondary-300 dark:text-secondary-600" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 left-2 flex gap-2">
                                            <Badge
                                                variant={vehicle.vehicleType.slug === 'bike' ? 'primary' : 'info'}
                                                size="sm"
                                            >
                                                {vehicle.vehicleType.name}
                                            </Badge>
                                        </div>
                                        {vehicle.isActive && (
                                            <Badge
                                                variant="primary"
                                                className="absolute top-2 right-2"
                                            >
                                                <StarIcon className="h-3 w-3 mr-1" />
                                                Primary
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center gap-1.5">
                                            <h3 className="font-semibold text-secondary-900 dark:text-white">
                                                {vehicle.displayName}
                                            </h3>
                                            {isPremium && <ProBadge size="sm" />}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            {vehicle.engineSpec && (
                                                <span className="text-sm text-secondary-500 dark:text-secondary-400">
                                                    {vehicle.engineSpec}
                                                </span>
                                            )}
                                            {vehicle.category && (
                                                <>
                                                    <span className="text-secondary-300 dark:text-secondary-600">
                                                        &bull;
                                                    </span>
                                                    <span className="text-sm text-secondary-500 dark:text-secondary-400">
                                                        {vehicle.category.name}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <EmptyState
                            icon={<TruckIcon className="h-8 w-8" />}
                            title="No vehicles yet"
                            description="Add your first vehicle to start challenging other riders"
                            action={{
                                label: 'Add Vehicle',
                                onClick: () => (window.location.href = route('vehicles.create')),
                            }}
                        />
                    </Card>
                )}
            </div>

            <FloatingActionButton
                icon={<PlusIcon className="h-6 w-6" />}
                onClick={() => (window.location.href = route('vehicles.create'))}
            />
        </AuthenticatedLayout>
    );
}
