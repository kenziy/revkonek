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
import { FormEventHandler, useState } from 'react';
import clsx from 'clsx';
import type { VehicleType } from '@/types/vehicle';

interface VehiclesCreateProps {
    vehicleTypes: VehicleType[];
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

export default function VehiclesCreate({ vehicleTypes }: VehiclesCreateProps) {
    const [step, setStep] = useState(1);
    const [selectedType, setSelectedType] = useState<VehicleType | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        vehicle_type_id: 0,
        vehicle_category_id: '',
        make: '',
        model: '',
        year: currentYear,
        modification_level: 'stock',
        color: '',
        plate_number: '',
        notes: '',
        is_active: false,
        photo: null as File | null,
        // Bike-specific
        cc: '',
        // Car-specific
        engine_liters: '',
        horsepower: '',
        transmission: '',
        drivetrain: '',
        doors: '',
    });

    const handleTypeSelect = (type: VehicleType) => {
        setSelectedType(type);
        setData('vehicle_type_id', type.id);
        setStep(2);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('vehicles.store'), {
            forceFormData: true,
        });
    };

    const handlePhotoChange = (files: File[]) => {
        setData('photo', files[0] || null);
    };

    const categoryOptions = selectedType?.categories?.map(cat => ({
        value: cat.id,
        label: cat.name,
    })) || [];

    if (step === 1) {
        return (
            <AuthenticatedLayout header="Add New Vehicle">
                <Head title="Add Vehicle" />

                <div className="max-w-2xl mx-auto">
                    <Card padding="lg">
                        <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-6">
                            What type of vehicle do you want to add?
                        </h2>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {vehicleTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => handleTypeSelect(type)}
                                    className={clsx(
                                        'p-6 rounded-xl border-2 text-left transition-all',
                                        'hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20',
                                        'border-secondary-200 dark:border-secondary-700'
                                    )}
                                >
                                    <div className="text-3xl mb-3">
                                        {type.slug === 'bike' ? '🏍️' : '🚗'}
                                    </div>
                                    <h3 className="font-semibold text-secondary-900 dark:text-white">
                                        {type.name}
                                    </h3>
                                    <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                                        {type.slug === 'bike'
                                            ? 'Motorcycles, scooters, and other two-wheelers'
                                            : 'Cars, trucks, and other four-wheelers'}
                                    </p>
                                </button>
                            ))}
                        </div>

                        <div className="mt-6 pt-6 border-t border-secondary-200 dark:border-secondary-700">
                            <Link href={route('vehicles.index')}>
                                <SecondaryButton type="button">
                                    Cancel
                                </SecondaryButton>
                            </Link>
                        </div>
                    </Card>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout header={`Add New ${selectedType?.name || 'Vehicle'}`}>
            <Head title={`Add ${selectedType?.name || 'Vehicle'}`} />

            <div className="max-w-2xl mx-auto">
                <Card padding="lg">
                    <div className="mb-6">
                        <button
                            onClick={() => setStep(1)}
                            className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
                        >
                            &larr; Change vehicle type
                        </button>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <InputLabel htmlFor="make" value="Make" />
                                <TextInput
                                    id="make"
                                    value={data.make}
                                    onChange={(e) => setData('make', e.target.value)}
                                    placeholder={selectedType?.slug === 'bike'
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
                                    placeholder={selectedType?.slug === 'bike'
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
                        {selectedType?.slug === 'bike' && (
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
                        {selectedType?.slug === 'car' && (
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
                            <InputLabel value="Photo (Optional)" />
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
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-4">
                            <Link href={route('vehicles.index')}>
                                <SecondaryButton type="button">
                                    Cancel
                                </SecondaryButton>
                            </Link>
                            <PrimaryButton type="submit" disabled={processing}>
                                {processing ? 'Adding...' : `Add ${selectedType?.name || 'Vehicle'}`}
                            </PrimaryButton>
                        </div>
                    </form>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
