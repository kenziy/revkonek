import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card } from '@/Components/UI';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Select from '@/Components/Form/Select';
import Textarea from '@/Components/Form/Textarea';
import FileUpload from '@/Components/Form/FileUpload';
import Switch from '@/Components/Form/Switch';
import { FormEventHandler } from 'react';
import { TruckIcon } from '@heroicons/react/24/outline';
import type { VehicleForEdit, VehicleCategory } from '@/types/vehicle';

interface VehiclesEditProps {
    vehicle?: VehicleForEdit;
    categories: VehicleCategory[];
}

const modificationLevels = [
    { value: 'stock', label: 'Stock' },
    { value: 'mild', label: 'Mild' },
    { value: 'built', label: 'Built' },
];

const transmissionOptions = [
    { value: '', label: 'Select transmission' },
    { value: 'manual', label: 'Manual' },
    { value: 'automatic', label: 'Automatic' },
    { value: 'cvt', label: 'CVT' },
    { value: 'dct', label: 'DCT' },
];

const drivetrainOptions = [
    { value: '', label: 'Select drivetrain' },
    { value: 'fwd', label: 'FWD (Front-Wheel Drive)' },
    { value: 'rwd', label: 'RWD (Rear-Wheel Drive)' },
    { value: 'awd', label: 'AWD (All-Wheel Drive)' },
    { value: '4wd', label: '4WD (Four-Wheel Drive)' },
];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 50 }, (_, i) => ({
    value: currentYear - i,
    label: String(currentYear - i),
}));

export default function VehiclesEdit({ vehicle, categories }: VehiclesEditProps) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        vehicle_category_id: vehicle?.vehicleCategoryId?.toString() || '',
        make: vehicle?.make || '',
        model: vehicle?.model || '',
        year: vehicle?.year || currentYear,
        modification_level: vehicle?.modificationLevel || 'stock',
        color: vehicle?.color || '',
        plate_number: vehicle?.plateNumber || '',
        notes: vehicle?.notes || '',
        is_active: vehicle?.isActive || false,
        is_available_for_match: vehicle?.isAvailableForMatch || false,
        photo: null as File | null,
        // Bike-specific
        cc: vehicle?.cc?.toString() || '',
        // Car-specific
        engine_liters: vehicle?.engineLiters?.toString() || '',
        horsepower: vehicle?.horsepower?.toString() || '',
        transmission: vehicle?.transmission || '',
        drivetrain: vehicle?.drivetrain || '',
        doors: vehicle?.doors?.toString() || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (vehicle) {
            post(route('vehicles.update', vehicle.id), {
                forceFormData: true,
            });
        }
    };

    const handlePhotoChange = (files: File[]) => {
        setData('photo', files[0] || null);
    };

    const categoryOptions = categories.map(cat => ({
        value: cat.id,
        label: cat.name,
    }));

    if (!vehicle) {
        return (
            <AuthenticatedLayout header="Edit Vehicle">
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

    const isBike = vehicle.vehicleType.slug === 'bike';
    const isCar = vehicle.vehicleType.slug === 'car';

    return (
        <AuthenticatedLayout header={`Edit ${vehicle.make} ${vehicle.model}`}>
            <Head title={`Edit ${vehicle.make} ${vehicle.model}`} />

            <div className="max-w-2xl mx-auto">
                <Card padding="lg">
                    <form onSubmit={submit} className="space-y-6">
                        {vehicle.photo && (
                            <div className="mb-6">
                                <img
                                    src={vehicle.photo}
                                    alt={`${vehicle.make} ${vehicle.model}`}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                            </div>
                        )}

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <InputLabel htmlFor="make" value="Make" />
                                <TextInput
                                    id="make"
                                    value={data.make}
                                    onChange={(e) => setData('make', e.target.value)}
                                    placeholder={isBike
                                        ? 'e.g., Honda, Yamaha, Kawasaki'
                                        : 'e.g., Toyota, Honda, Ford'}
                                    className="mt-1"
                                    required
                                />
                                <InputError message={errors.make} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="model" value="Model" />
                                <TextInput
                                    id="model"
                                    value={data.model}
                                    onChange={(e) => setData('model', e.target.value)}
                                    placeholder={isBike
                                        ? 'e.g., CBR600RR, R6, ZX-6R'
                                        : 'e.g., Civic, Camry, Mustang'}
                                    className="mt-1"
                                    required
                                />
                                <InputError message={errors.model} className="mt-2" />
                            </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <InputLabel htmlFor="year" value="Year" />
                                <Select
                                    id="year"
                                    value={data.year}
                                    onChange={(e) => setData('year', Number(e.target.value))}
                                    options={yearOptions}
                                    className="mt-1"
                                />
                                <InputError message={errors.year} className="mt-2" />
                            </div>

                            {categoryOptions.length > 0 && (
                                <div>
                                    <InputLabel htmlFor="category" value="Category" />
                                    <Select
                                        id="category"
                                        value={data.vehicle_category_id}
                                        onChange={(e) => setData('vehicle_category_id', e.target.value)}
                                        options={[{ value: '', label: 'Select category' }, ...categoryOptions]}
                                        className="mt-1"
                                    />
                                    <InputError message={errors.vehicle_category_id} className="mt-2" />
                                </div>
                            )}
                        </div>

                        {/* Bike-specific fields */}
                        {isBike && (
                            <div>
                                <InputLabel htmlFor="cc" value="Engine Displacement (cc)" />
                                <TextInput
                                    id="cc"
                                    type="number"
                                    value={data.cc}
                                    onChange={(e) => setData('cc', e.target.value)}
                                    placeholder="e.g., 600, 1000"
                                    className="mt-1"
                                    min="50"
                                    max="3000"
                                    required
                                />
                                <InputError message={errors.cc} className="mt-2" />
                            </div>
                        )}

                        {/* Car-specific fields */}
                        {isCar && (
                            <>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="engine_liters" value="Engine Size (Liters)" />
                                        <TextInput
                                            id="engine_liters"
                                            type="number"
                                            step="0.1"
                                            value={data.engine_liters}
                                            onChange={(e) => setData('engine_liters', e.target.value)}
                                            placeholder="e.g., 2.0, 3.5"
                                            className="mt-1"
                                        />
                                        <InputError message={errors.engine_liters} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="horsepower" value="Horsepower" />
                                        <TextInput
                                            id="horsepower"
                                            type="number"
                                            value={data.horsepower}
                                            onChange={(e) => setData('horsepower', e.target.value)}
                                            placeholder="e.g., 200, 450"
                                            className="mt-1"
                                        />
                                        <InputError message={errors.horsepower} className="mt-2" />
                                    </div>
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="transmission" value="Transmission" />
                                        <Select
                                            id="transmission"
                                            value={data.transmission}
                                            onChange={(e) => setData('transmission', e.target.value)}
                                            options={transmissionOptions}
                                            className="mt-1"
                                        />
                                        <InputError message={errors.transmission} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="drivetrain" value="Drivetrain" />
                                        <Select
                                            id="drivetrain"
                                            value={data.drivetrain}
                                            onChange={(e) => setData('drivetrain', e.target.value)}
                                            options={drivetrainOptions}
                                            className="mt-1"
                                        />
                                        <InputError message={errors.drivetrain} className="mt-2" />
                                    </div>
                                </div>

                                <div className="w-1/2 sm:w-1/4">
                                    <InputLabel htmlFor="doors" value="Doors" />
                                    <TextInput
                                        id="doors"
                                        type="number"
                                        value={data.doors}
                                        onChange={(e) => setData('doors', e.target.value)}
                                        placeholder="e.g., 2, 4"
                                        className="mt-1"
                                        min="2"
                                        max="5"
                                    />
                                    <InputError message={errors.doors} className="mt-2" />
                                </div>
                            </>
                        )}

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <InputLabel htmlFor="modification_level" value="Modification Level" />
                                <Select
                                    id="modification_level"
                                    value={data.modification_level}
                                    onChange={(e) => setData('modification_level', e.target.value)}
                                    options={modificationLevels}
                                    className="mt-1"
                                />
                                <InputError message={errors.modification_level} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="color" value="Color (Optional)" />
                                <TextInput
                                    id="color"
                                    value={data.color}
                                    onChange={(e) => setData('color', e.target.value)}
                                    placeholder="e.g., Red, Matte Black"
                                    className="mt-1"
                                />
                                <InputError message={errors.color} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="plate_number" value="Plate Number (Optional)" />
                            <TextInput
                                id="plate_number"
                                value={data.plate_number}
                                onChange={(e) => setData('plate_number', e.target.value)}
                                placeholder="e.g., ABC 1234"
                                className="mt-1 sm:w-1/2"
                            />
                            <InputError message={errors.plate_number} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="notes" value="Notes (Optional)" />
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Any additional information about your vehicle..."
                                rows={3}
                                className="mt-1"
                            />
                            <InputError message={errors.notes} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel value="Update Photo (Optional)" />
                            <FileUpload
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="mt-1"
                            />
                            <InputError message={errors.photo} className="mt-2" />
                        </div>

                        <div className="border-t border-secondary-200 dark:border-secondary-700 pt-6 space-y-4">
                            <Switch
                                checked={data.is_active}
                                onChange={(checked) => setData('is_active', checked)}
                                label="Set as primary vehicle"
                                description="This vehicle will be displayed as your main ride on your profile"
                            />
                            <Switch
                                checked={data.is_available_for_match}
                                onChange={(checked) => setData('is_available_for_match', checked)}
                                label="Available for match"
                                description="Make this vehicle visible to others looking for a challenge"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-4">
                            <Link href={route('vehicles.show', vehicle.id)}>
                                <SecondaryButton type="button">
                                    Cancel
                                </SecondaryButton>
                            </Link>
                            <PrimaryButton type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Save Changes'}
                            </PrimaryButton>
                        </div>
                    </form>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
