import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, Badge, Avatar, ProBadge } from '@/Components/UI';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import clsx from 'clsx';
import {
    PencilIcon,
    TrashIcon,
    StarIcon,
    TruckIcon,
    WrenchScrewdriverIcon,
    SwatchIcon,
    CalendarDaysIcon,
    TagIcon,
    SparklesIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { useState } from 'react';
import Modal from '@/Components/Modal';
import { getTemplate } from '@/Components/Vehicles/Templates';
import type { Vehicle } from '@/types/vehicle';

interface VehiclesShowProps {
    vehicle?: Vehicle;
    isOwner: boolean;
    ownerIsPremium?: boolean;
    isLiked?: boolean;
    likesCount?: number;
}

export default function VehiclesShow({ vehicle, isOwner, ownerIsPremium = false, isLiked = false, likesCount = 0 }: VehiclesShowProps) {
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    const handleToggleLike = () => {
        if (vehicle) {
            router.post(route('vehicles.toggleLike', vehicle.uuid), {}, {
                preserveScroll: true,
            });
        }
    };

    const handleDelete = () => {
        if (vehicle) {
            router.delete(route('vehicles.destroy', vehicle.uuid));
        }
    };

    const handleSetActive = () => {
        if (vehicle) {
            router.post(route('vehicles.setActive', vehicle.uuid));
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

    // Select layout template — only premium owners get non-Classic templates
    const TemplateComponent = ownerIsPremium
        ? getTemplate(vehicle.layoutTemplate)
        : getTemplate('classic');

    const accentStyle = ownerIsPremium && vehicle.accentColor
        ? { '--vehicle-accent': vehicle.accentColor } as React.CSSProperties
        : undefined;

    // Collect quick specs for the info bar
    const quickSpecs: { icon: React.ReactNode; label: string }[] = [];
    if (vehicle.year) {
        quickSpecs.push({ icon: <CalendarDaysIcon className="h-4 w-4" />, label: String(vehicle.year) });
    }
    if (vehicle.engineSpec) {
        quickSpecs.push({ icon: <TruckIcon className="h-4 w-4" />, label: vehicle.engineSpec });
    }
    if (vehicle.color) {
        quickSpecs.push({ icon: <SwatchIcon className="h-4 w-4" />, label: vehicle.color });
    }
    if (vehicle.modificationLevel && vehicle.modificationLevel !== 'stock') {
        quickSpecs.push({ icon: <WrenchScrewdriverIcon className="h-4 w-4" />, label: vehicle.modificationLevel });
    }
    if (vehicle.category) {
        quickSpecs.push({ icon: <TagIcon className="h-4 w-4" />, label: vehicle.category.name });
    }

    return (
        <AuthenticatedLayout header={vehicle.displayName}>
            <Head title={vehicle.displayName} />

            <div className="max-w-4xl mx-auto space-y-6" style={accentStyle}>

                {/* Top bar: owner actions or info */}
                <div className={clsx(
                    'flex items-center gap-3 flex-wrap',
                    isOwner ? 'justify-between' : 'justify-end',
                )}>
                    {isOwner && (
                        <div className="flex items-center gap-2">
                            {vehicle.isActive && (
                                <Badge variant="primary" size="sm">
                                    <StarIconSolid className="h-3 w-3 -ml-0.5" />
                                    Primary Vehicle
                                </Badge>
                            )}
                            {ownerIsPremium && (
                                <Badge variant="warning" size="sm">
                                    <SparklesIcon className="h-3 w-3 -ml-0.5" />
                                    PRO
                                </Badge>
                            )}
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        {/* Like button */}
                        <button
                            onClick={handleToggleLike}
                            className={clsx(
                                'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all',
                                isLiked
                                    ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30'
                                    : 'bg-white dark:bg-secondary-700 border border-secondary-200 dark:border-secondary-600 text-secondary-600 dark:text-secondary-300 hover:border-red-300 dark:hover:border-red-500/40 hover:text-red-500',
                            )}
                        >
                            {isLiked ? (
                                <HeartIconSolid className="h-5 w-5 text-red-500" />
                            ) : (
                                <HeartIconOutline className="h-5 w-5" />
                            )}
                            {likesCount > 0 ? likesCount : 'Like'}
                        </button>
                        {isOwner && (
                            <Link href={route('vehicles.edit', vehicle.uuid)}>
                                <SecondaryButton>
                                    <PencilIcon className="h-4 w-4 mr-1.5" />
                                    Edit
                                </SecondaryButton>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Quick Specs Bar */}
                {quickSpecs.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                        {quickSpecs.map((spec, i) => (
                            <span
                                key={i}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary-100 dark:bg-secondary-700/60 text-sm text-secondary-700 dark:text-secondary-300"
                            >
                                {spec.icon}
                                {spec.label}
                            </span>
                        ))}
                    </div>
                )}

                {/* Pro accent border wrapper */}
                <div className={clsx(
                    ownerIsPremium && 'ring-1 ring-amber-400/30 rounded-2xl',
                )}>
                    {/* Template renders the vehicle content */}
                    <TemplateComponent
                        vehicle={vehicle}
                        isOwner={isOwner}
                        ownerIsPremium={ownerIsPremium}
                    />
                </div>

                {/* Owner Profile Card */}
                {vehicle.owner && (
                    <Card padding="lg" className={clsx(
                        ownerIsPremium && 'border border-amber-400/20 dark:border-amber-400/10',
                    )}>
                        <div className="flex items-center gap-4">
                            <Link href={route('profile.show', vehicle.owner.uuid)}>
                                <Avatar
                                    src={vehicle.owner.avatar}
                                    name={vehicle.owner.displayName}
                                    size="lg"
                                />
                            </Link>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Link
                                        href={route('profile.show', vehicle.owner.uuid)}
                                        className="font-semibold text-secondary-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                    >
                                        {vehicle.owner.displayName}
                                    </Link>
                                    {vehicle.owner.isPremium && <ProBadge size="sm" />}
                                </div>
                                {vehicle.owner.username && (
                                    <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                        @{vehicle.owner.username}
                                    </p>
                                )}
                            </div>
                            {!isOwner && (
                                <Link
                                    href={route('profile.show', vehicle.owner.uuid)}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary-600 hover:bg-primary-500 text-white transition-colors shrink-0"
                                >
                                    View Profile
                                </Link>
                            )}
                        </div>
                    </Card>
                )}

                {/* Owner Actions */}
                {isOwner && (
                    <Card padding="lg">
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
