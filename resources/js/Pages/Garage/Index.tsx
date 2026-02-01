import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, Badge, EmptyState, FloatingActionButton } from '@/Components/UI';
import clsx from 'clsx';
import { PlusIcon, WrenchScrewdriverIcon, StarIcon } from '@heroicons/react/24/outline';

interface Bike {
    id: number;
    make: string;
    model: string;
    year: number;
    cc: number;
    photo?: string;
    isPrimary: boolean;
    mods?: string[];
}

interface GarageIndexProps {
    bikes?: Bike[];
}

export default function GarageIndex({ bikes = [] }: GarageIndexProps) {
    return (
        <AuthenticatedLayout header="My Garage">
            <Head title="Garage" />

            <div className="space-y-6">
                {bikes.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {bikes.map((bike) => (
                            <Link key={bike.id} href={route('garage.show', bike.id)}>
                                <Card hoverable padding="none" className="overflow-hidden">
                                    <div className="aspect-video bg-secondary-100 dark:bg-secondary-800 relative">
                                        {bike.photo ? (
                                            <img
                                                src={bike.photo}
                                                alt={`${bike.make} ${bike.model}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <WrenchScrewdriverIcon className="h-12 w-12 text-secondary-300 dark:text-secondary-600" />
                                            </div>
                                        )}
                                        {bike.isPrimary && (
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
                                        <h3 className="font-semibold text-secondary-900 dark:text-white">
                                            {bike.year} {bike.make} {bike.model}
                                        </h3>
                                        <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                                            {bike.cc}cc
                                        </p>
                                        {bike.mods && bike.mods.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {bike.mods.slice(0, 3).map((mod, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="secondary"
                                                        size="sm"
                                                    >
                                                        {mod}
                                                    </Badge>
                                                ))}
                                                {bike.mods.length > 3 && (
                                                    <Badge variant="secondary" size="sm">
                                                        +{bike.mods.length - 3}
                                                    </Badge>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <EmptyState
                            icon={<WrenchScrewdriverIcon className="h-8 w-8" />}
                            title="Your garage is empty"
                            description="Add your first bike to start challenging other riders"
                            action={{
                                label: 'Add Bike',
                                onClick: () => (window.location.href = route('garage.create')),
                            }}
                        />
                    </Card>
                )}
            </div>

            <FloatingActionButton
                icon={<PlusIcon className="h-6 w-6" />}
                onClick={() => (window.location.href = route('garage.create'))}
            />
        </AuthenticatedLayout>
    );
}
