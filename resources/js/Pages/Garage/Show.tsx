import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, Badge } from '@/Components/UI';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import { PencilIcon, TrashIcon, StarIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useState } from 'react';
import Modal from '@/Components/Modal';

interface Bike {
    id: number;
    make: string;
    model: string;
    year: number;
    cc: number;
    category: string;
    modification_level: string;
    color?: string;
    plate_number?: string;
    notes?: string;
    is_active: boolean;
    photo?: string;
    photos?: { id: number; url: string; is_primary: boolean }[];
}

interface GarageShowProps {
    id: string;
    bike?: Bike;
}

const categoryLabels: Record<string, string> = {
    sport: 'Sport',
    naked: 'Naked',
    cruiser: 'Cruiser',
    touring: 'Touring',
    adventure: 'Adventure',
    scooter: 'Scooter',
    underbone: 'Underbone',
    dual_sport: 'Dual Sport',
    supermoto: 'Supermoto',
    cafe_racer: 'Cafe Racer',
    bobber: 'Bobber',
    scrambler: 'Scrambler',
    other: 'Other',
};

const modLevelLabels: Record<string, string> = {
    stock: 'Stock',
    mild: 'Mild',
    built: 'Built',
};

export default function GarageShow({ id, bike }: GarageShowProps) {
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    const handleDelete = () => {
        router.delete(route('garage.destroy', id));
    };

    const handleSetActive = () => {
        router.post(route('garage.setActive', id));
    };

    if (!bike) {
        return (
            <AuthenticatedLayout header="Bike Details">
                <Head title="Bike Not Found" />
                <Card className="text-center py-12">
                    <WrenchScrewdriverIcon className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
                        Bike not found
                    </h3>
                    <p className="text-secondary-500 dark:text-secondary-400 mb-6">
                        This bike may have been removed or doesn't exist.
                    </p>
                    <Link href={route('garage.index')}>
                        <PrimaryButton>Back to Garage</PrimaryButton>
                    </Link>
                </Card>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout header={`${bike.year} ${bike.make} ${bike.model}`}>
            <Head title={`${bike.make} ${bike.model}`} />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Photo Section */}
                <Card padding="none" className="overflow-hidden">
                    <div className="aspect-video bg-secondary-100 dark:bg-secondary-800 relative">
                        {bike.photo ? (
                            <img
                                src={bike.photo}
                                alt={`${bike.make} ${bike.model}`}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <WrenchScrewdriverIcon className="h-20 w-20 text-secondary-300 dark:text-secondary-600" />
                            </div>
                        )}
                        {bike.is_active && (
                            <Badge variant="primary" className="absolute top-4 right-4">
                                <StarIconSolid className="h-4 w-4 mr-1" />
                                Primary Bike
                            </Badge>
                        )}
                    </div>
                </Card>

                {/* Details Section */}
                <Card>
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
                                {bike.year} {bike.make} {bike.model}
                            </h2>
                            <p className="text-secondary-500 dark:text-secondary-400 mt-1">
                                {bike.cc}cc {categoryLabels[bike.category] || bike.category}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Link href={route('garage.edit', id)}>
                                <SecondaryButton>
                                    <PencilIcon className="h-4 w-4 mr-2" />
                                    Edit
                                </SecondaryButton>
                            </Link>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-4">
                            <div>
                                <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                                    Category
                                </dt>
                                <dd className="mt-1 text-secondary-900 dark:text-white">
                                    {categoryLabels[bike.category] || bike.category}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                                    Modification Level
                                </dt>
                                <dd className="mt-1">
                                    <Badge
                                        variant={
                                            bike.modification_level === 'built'
                                                ? 'warning'
                                                : bike.modification_level === 'mild'
                                                  ? 'info'
                                                  : 'secondary'
                                        }
                                    >
                                        {modLevelLabels[bike.modification_level] || bike.modification_level}
                                    </Badge>
                                </dd>
                            </div>
                            {bike.color && (
                                <div>
                                    <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                                        Color
                                    </dt>
                                    <dd className="mt-1 text-secondary-900 dark:text-white">
                                        {bike.color}
                                    </dd>
                                </div>
                            )}
                        </div>
                        <div className="space-y-4">
                            <div>
                                <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                                    Engine Displacement
                                </dt>
                                <dd className="mt-1 text-secondary-900 dark:text-white">
                                    {bike.cc}cc
                                </dd>
                            </div>
                            {bike.plate_number && (
                                <div>
                                    <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                                        Plate Number
                                    </dt>
                                    <dd className="mt-1 text-secondary-900 dark:text-white">
                                        {bike.plate_number}
                                    </dd>
                                </div>
                            )}
                        </div>
                    </div>

                    {bike.notes && (
                        <div className="mt-6 pt-6 border-t border-secondary-200 dark:border-secondary-700">
                            <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                                Notes
                            </dt>
                            <dd className="mt-1 text-secondary-900 dark:text-white whitespace-pre-wrap">
                                {bike.notes}
                            </dd>
                        </div>
                    )}
                </Card>

                {/* Actions Section */}
                <Card>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {!bike.is_active && (
                            <button
                                onClick={handleSetActive}
                                className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                            >
                                <StarIcon className="h-5 w-5 mr-2" />
                                Set as primary bike
                            </button>
                        )}
                        <div className="ml-auto">
                            <DangerButton onClick={() => setConfirmingDelete(true)}>
                                <TrashIcon className="h-4 w-4 mr-2" />
                                Delete Bike
                            </DangerButton>
                        </div>
                    </div>
                </Card>
            </div>

            <Modal show={confirmingDelete} onClose={() => setConfirmingDelete(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-secondary-900 dark:text-white">
                        Delete this bike?
                    </h2>
                    <p className="mt-2 text-sm text-secondary-500 dark:text-secondary-400">
                        Are you sure you want to remove this bike from your garage? This action cannot be undone.
                    </p>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setConfirmingDelete(false)}>
                            Cancel
                        </SecondaryButton>
                        <DangerButton onClick={handleDelete}>
                            Delete Bike
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
