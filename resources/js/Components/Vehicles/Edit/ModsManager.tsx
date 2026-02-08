import { useForm, router } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import Textarea from '@/Components/Form/Textarea';
import Select from '@/Components/Form/Select';
import PrimaryButton from '@/Components/PrimaryButton';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import type { VehicleMod, ModCategory } from '@/types/vehicle';

interface ModsManagerProps {
    vehicleUuid: string;
    mods: VehicleMod[];
}

const categoryOptions: { value: ModCategory; label: string }[] = [
    { value: 'engine', label: 'Engine' },
    { value: 'suspension', label: 'Suspension' },
    { value: 'exhaust', label: 'Exhaust' },
    { value: 'brakes', label: 'Brakes' },
    { value: 'cosmetic', label: 'Cosmetic' },
    { value: 'wheels', label: 'Wheels & Tires' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'other', label: 'Other' },
];

export default function ModsManager({ vehicleUuid, mods }: ModsManagerProps) {
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        category: 'engine' as ModCategory,
        name: '',
        brand: '',
        description: '',
        price: '',
        installed_at: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('vehicles.mods.store', vehicleUuid), {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    const handleDelete = (modId: number) => {
        router.delete(route('vehicles.mods.destroy', { vehicle: vehicleUuid, mod: modId }));
    };

    return (
        <div className="space-y-4">
            {/* Existing mods list */}
            {mods.length > 0 && (
                <div className="space-y-2">
                    {mods.map((mod) => (
                        <div
                            key={mod.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-secondary-50 dark:bg-secondary-800/50"
                        >
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-secondary-200 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-400">
                                        {mod.categoryLabel}
                                    </span>
                                    <span className="font-medium text-secondary-900 dark:text-white">
                                        {mod.name}
                                    </span>
                                </div>
                                {mod.brand && (
                                    <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-0.5">
                                        {mod.brand}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {mod.price && (
                                    <span className="text-sm text-secondary-600 dark:text-secondary-400">
                                        ₱{parseFloat(mod.price).toLocaleString()}
                                    </span>
                                )}
                                <button
                                    onClick={() => handleDelete(mod.id)}
                                    className="p-1 text-secondary-400 hover:text-danger-500"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add mod form */}
            {showForm ? (
                <form onSubmit={handleSubmit} className="p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="mod_category" value="Category" />
                            <Select
                                id="mod_category"
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value as ModCategory)}
                                options={categoryOptions}
                                className="mt-1"
                            />
                            <InputError message={errors.category} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel htmlFor="mod_name" value="Part/Mod Name" />
                            <TextInput
                                id="mod_name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g., Yoshimura R-77"
                                className="mt-1"
                                required
                            />
                            <InputError message={errors.name} className="mt-1" />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <InputLabel htmlFor="mod_brand" value="Brand (Optional)" />
                            <TextInput
                                id="mod_brand"
                                value={data.brand}
                                onChange={(e) => setData('brand', e.target.value)}
                                placeholder="e.g., Yoshimura"
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="mod_price" value="Price (Optional)" />
                            <TextInput
                                id="mod_price"
                                type="number"
                                step="0.01"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                placeholder="0.00"
                                className="mt-1"
                            />
                            <InputError message={errors.price} className="mt-1" />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="mod_description" value="Description (Optional)" />
                        <Textarea
                            id="mod_description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Brief description of the mod..."
                            rows={2}
                            className="mt-1"
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => { reset(); setShowForm(false); }}
                            className="px-3 py-1.5 text-sm text-secondary-600 dark:text-secondary-400"
                        >
                            Cancel
                        </button>
                        <PrimaryButton type="submit" disabled={processing}>
                            {processing ? 'Adding...' : 'Add Mod'}
                        </PrimaryButton>
                    </div>
                </form>
            ) : (
                <button
                    onClick={() => setShowForm(true)}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-secondary-300 dark:border-secondary-600 text-secondary-500 dark:text-secondary-400 hover:border-primary-400 hover:text-primary-500 transition-colors"
                >
                    <PlusIcon className="h-5 w-5" />
                    Add Mod / Part
                </button>
            )}
        </div>
    );
}
