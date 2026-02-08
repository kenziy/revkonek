import { router } from '@inertiajs/react';
import { Card, Badge } from '@/Components/UI';
import { TrashIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import type { VehicleMod } from '@/types/vehicle';

interface ModsListProps {
    mods: VehicleMod[];
    vehicleUuid: string;
    isOwner?: boolean;
    className?: string;
}

const categoryColors: Record<string, string> = {
    engine: 'warning',
    suspension: 'info',
    exhaust: 'secondary',
    brakes: 'danger',
    cosmetic: 'primary',
    wheels: 'success',
    electronics: 'info',
    other: 'secondary',
};

export default function ModsList({ mods, vehicleUuid, isOwner = false, className }: ModsListProps) {
    if (!mods || mods.length === 0) return null;

    // Group mods by category
    const grouped = mods.reduce<Record<string, VehicleMod[]>>((acc, mod) => {
        const key = mod.category;
        if (!acc[key]) acc[key] = [];
        acc[key].push(mod);
        return acc;
    }, {});

    const totalInvestment = mods.reduce((sum, mod) => sum + (parseFloat(mod.price || '0') || 0), 0);

    const handleDelete = (modId: number) => {
        router.delete(route('vehicles.mods.destroy', { vehicle: vehicleUuid, mod: modId }));
    };

    return (
        <div className={className}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white flex items-center gap-2">
                    <WrenchScrewdriverIcon className="h-5 w-5" />
                    Mods & Parts
                </h3>
                {totalInvestment > 0 && (
                    <span className="text-sm text-secondary-500 dark:text-secondary-400">
                        Total: ₱{totalInvestment.toLocaleString()}
                    </span>
                )}
            </div>

            <div className="space-y-4">
                {Object.entries(grouped).map(([category, categoryMods]) => (
                    <div key={category}>
                        <Badge variant={categoryColors[category] as any || 'secondary'} size="sm" className="mb-2">
                            {categoryMods[0].categoryLabel}
                        </Badge>
                        <div className="space-y-2">
                            {categoryMods.map((mod) => (
                                <div
                                    key={mod.id}
                                    className="flex items-center justify-between p-3 rounded-lg bg-secondary-50 dark:bg-secondary-800/50"
                                >
                                    <div>
                                        <p className="font-medium text-secondary-900 dark:text-white">
                                            {mod.name}
                                        </p>
                                        {mod.brand && (
                                            <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                                {mod.brand}
                                            </p>
                                        )}
                                        {mod.description && (
                                            <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-0.5">
                                                {mod.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {mod.price && (
                                            <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                                                ₱{parseFloat(mod.price).toLocaleString()}
                                            </span>
                                        )}
                                        {isOwner && (
                                            <button
                                                onClick={() => handleDelete(mod.id)}
                                                className="p-1 text-secondary-400 hover:text-danger-500 transition-colors"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
