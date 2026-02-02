import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, Badge } from '@/Components/UI';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import { PencilIcon, TrashIcon, StarIcon, TruckIcon, BoltIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import type { Vehicle } from '@/types/vehicle';

interface VehiclesShowProps {
    vehicle?: Vehicle;
    isOwner: boolean;
}

const modLevelLabels: Record<string, string> = {
    stock: 'Stock',
    mild: 'Mild',
    built: 'Built',
};

export default function VehiclesShow({ vehicle, isOwner }: VehiclesShowProps) {
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    const handleDelete = () => {
        if (vehicle) {
            router.delete(route('vehicles.destroy', vehicle.id));
        }
    };

    const handleSetActive = () => {
        if (vehicle) {
            router.post(route('vehicles.setActive', vehicle.id));
        }
    };

    const handleToggleMatch = () => {
        if (vehicle) {
            router.post(route('vehicles.toggleMatch', vehicle.id));
        }
    };

    if (!vehicle) {
        return (
            <AuthenticatedLayout header="Vehicle Details">
                <Head title="Vehicle Not Found" />
                <Card className="text-center py-12">
                    <TruckIcon className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
                        Vehicle not found
                    </h3>
                    <p className="text-secondary-500 dark:text-secondary-400 mb-6">
                        This vehicle may have been removed or doesn't exist.
                    </p>
                    <Link href={route('vehicles.index')}>
                        <PrimaryButton>Back to Vehicles</PrimaryButton>
                    </Link>
                </Card>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout header={vehicle.displayName}>
            <Head title={vehicle.displayName} />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Photo Section */}
                <Card padding="none" className="overflow-hidden">
                    <div className="aspect-video bg-secondary-100 dark:bg-secondary-800 relative">
                        {vehicle.photo ? (
                            <img
                                src={vehicle.photo}
                                alt={vehicle.displayName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <TruckIcon className="h-20 w-20 text-secondary-300 dark:text-secondary-600" />
                            </div>
                        )}
                        <div className="absolute top-4 left-4 flex gap-2">
                            <Badge variant={vehicle.vehicleType.slug === 'bike' ? 'primary' : 'info'}>
                                {vehicle.vehicleType.name}
                            </Badge>
                        </div>
                        {vehicle.isActive && (
                            <Badge variant="primary" className="absolute top-4 right-4">
                                <StarIconSolid className="h-4 w-4 mr-1" />
                                Primary Vehicle
                            </Badge>
                        )}
                        {vehicle.isAvailableForMatch && (
                            <Badge variant="success" className="absolute bottom-4 right-4">
                                <BoltIcon className="h-4 w-4 mr-1" />
                                Match Ready
                            </Badge>
                        )}
                    </div>
                </Card>

                {/* Details Section */}
                <Card>
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
                                {vehicle.displayName}
                            </h2>
                            <div className="flex items-center gap-2 mt-1 text-secondary-500 dark:text-secondary-400">
                                {vehicle.engineSpec && <span>{vehicle.engineSpec}</span>}
                                {vehicle.category && (
                                    <>
                                        <span>&bull;</span>
                                        <span>{vehicle.category.name}</span>
                                    </>
                                )}
                            </div>
                        </div>
                        {isOwner && (
                            <div className="flex gap-2">
                                <Link href={route('vehicles.edit', vehicle.id)}>
                                    <SecondaryButton>
                                        <PencilIcon className="h-4 w-4 mr-2" />
                                        Edit
                                    </SecondaryButton>
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-4">
                            {vehicle.category && (
                                <div>
                                    <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                                        Category
                                    </dt>
                                    <dd className="mt-1 text-secondary-900 dark:text-white">
                                        {vehicle.category.name}
                                    </dd>
                                </div>
                            )}
                            <div>
                                <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                                    Modification Level
                                </dt>
                                <dd className="mt-1">
                                    <Badge
                                        variant={
                                            vehicle.modificationLevel === 'built'
                                                ? 'warning'
                                                : vehicle.modificationLevel === 'mild'
                                                  ? 'info'
                                                  : 'secondary'
                                        }
                                    >
                                        {modLevelLabels[vehicle.modificationLevel || 'stock'] || vehicle.modificationLevel}
                                    </Badge>
                                </dd>
                            </div>
                            {vehicle.color && (
                                <div>
                                    <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                                        Color
                                    </dt>
                                    <dd className="mt-1 text-secondary-900 dark:text-white">
                                        {vehicle.color}
                                    </dd>
                                </div>
                            )}
                        </div>
                        <div className="space-y-4">
                            {vehicle.vehicleType.slug === 'bike' && vehicle.bikeDetails && (
                                <div>
                                    <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                                        Engine Displacement
                                    </dt>
                                    <dd className="mt-1 text-secondary-900 dark:text-white">
                                        {vehicle.bikeDetails.cc}cc
                                    </dd>
                                </div>
                            )}
                            {vehicle.vehicleType.slug === 'car' && vehicle.carDetails && (
                                <>
                                    {vehicle.carDetails.engineLiters && (
                                        <div>
                                            <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                                                Engine Size
                                            </dt>
                                            <dd className="mt-1 text-secondary-900 dark:text-white">
                                                {vehicle.carDetails.engineLiters}L
                                            </dd>
                                        </div>
                                    )}
                                    {vehicle.carDetails.horsepower && (
                                        <div>
                                            <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                                                Horsepower
                                            </dt>
                                            <dd className="mt-1 text-secondary-900 dark:text-white">
                                                {vehicle.carDetails.horsepower} hp
                                            </dd>
                                        </div>
                                    )}
                                    {vehicle.carDetails.transmissionLabel && (
                                        <div>
                                            <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                                                Transmission
                                            </dt>
                                            <dd className="mt-1 text-secondary-900 dark:text-white">
                                                {vehicle.carDetails.transmissionLabel}
                                            </dd>
                                        </div>
                                    )}
                                    {vehicle.carDetails.drivetrainLabel && (
                                        <div>
                                            <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                                                Drivetrain
                                            </dt>
                                            <dd className="mt-1 text-secondary-900 dark:text-white">
                                                {vehicle.carDetails.drivetrainLabel}
                                            </dd>
                                        </div>
                                    )}
                                    {vehicle.carDetails.doors && (
                                        <div>
                                            <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                                                Doors
                                            </dt>
                                            <dd className="mt-1 text-secondary-900 dark:text-white">
                                                {vehicle.carDetails.doors}
                                            </dd>
                                        </div>
                                    )}
                                </>
                            )}
                            {vehicle.plateNumber && (
                                <div>
                                    <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                                        Plate Number
                                    </dt>
                                    <dd className="mt-1 text-secondary-900 dark:text-white">
                                        {vehicle.plateNumber}
                                    </dd>
                                </div>
                            )}
                        </div>
                    </div>

                    {vehicle.notes && (
                        <div className="mt-6 pt-6 border-t border-secondary-200 dark:border-secondary-700">
                            <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                                Notes
                            </dt>
                            <dd className="mt-1 text-secondary-900 dark:text-white whitespace-pre-wrap">
                                {vehicle.notes}
                            </dd>
                        </div>
                    )}

                    {!isOwner && vehicle.owner && (
                        <div className="mt-6 pt-6 border-t border-secondary-200 dark:border-secondary-700">
                            <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                                Owner
                            </dt>
                            <dd className="mt-1 text-secondary-900 dark:text-white">
                                {vehicle.owner.name}
                            </dd>
                        </div>
                    )}
                </Card>

                {/* Actions Section */}
                {isOwner && (
                    <Card>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap gap-4">
                                {!vehicle.isActive && (
                                    <button
                                        onClick={handleSetActive}
                                        className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                                    >
                                        <StarIcon className="h-5 w-5 mr-2" />
                                        Set as primary vehicle
                                    </button>
                                )}
                                <button
                                    onClick={handleToggleMatch}
                                    className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                                >
                                    <BoltIcon className="h-5 w-5 mr-2" />
                                    {vehicle.isAvailableForMatch ? 'Remove from match' : 'Make available for match'}
                                </button>
                            </div>
                            <div className="ml-auto">
                                <DangerButton onClick={() => setConfirmingDelete(true)}>
                                    <TrashIcon className="h-4 w-4 mr-2" />
                                    Delete Vehicle
                                </DangerButton>
                            </div>
                        </div>
                    </Card>
                )}
            </div>

            <Modal show={confirmingDelete} onClose={() => setConfirmingDelete(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-secondary-900 dark:text-white">
                        Delete this vehicle?
                    </h2>
                    <p className="mt-2 text-sm text-secondary-500 dark:text-secondary-400">
                        Are you sure you want to remove this vehicle? This action cannot be undone.
                    </p>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setConfirmingDelete(false)}>
                            Cancel
                        </SecondaryButton>
                        <DangerButton onClick={handleDelete}>
                            Delete Vehicle
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
