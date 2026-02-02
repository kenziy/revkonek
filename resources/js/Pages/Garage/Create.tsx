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

const bikeCategories = [
    { value: 'sport', label: 'Sport' },
    { value: 'naked', label: 'Naked' },
    { value: 'cruiser', label: 'Cruiser' },
    { value: 'touring', label: 'Touring' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'scooter', label: 'Scooter' },
    { value: 'underbone', label: 'Underbone' },
    { value: 'dual_sport', label: 'Dual Sport' },
    { value: 'supermoto', label: 'Supermoto' },
    { value: 'cafe_racer', label: 'Cafe Racer' },
    { value: 'bobber', label: 'Bobber' },
    { value: 'scrambler', label: 'Scrambler' },
    { value: 'other', label: 'Other' },
];

const modificationLevels = [
    { value: 'stock', label: 'Stock' },
    { value: 'mild', label: 'Mild' },
    { value: 'built', label: 'Built' },
];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 50 }, (_, i) => ({
    value: currentYear - i,
    label: String(currentYear - i),
}));

export default function GarageCreate() {
    const { data, setData, post, processing, errors } = useForm({
        make: '',
        model: '',
        year: currentYear,
        cc: '',
        category: '',
        modification_level: 'stock',
        color: '',
        plate_number: '',
        notes: '',
        is_active: false,
        photo: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('garage.store'), {
            forceFormData: true,
        });
    };

    const handlePhotoChange = (files: File[]) => {
        setData('photo', files[0] || null);
    };

    return (
        <AuthenticatedLayout header="Add New Bike">
            <Head title="Add Bike" />

            <div className="max-w-2xl mx-auto">
                <Card padding="lg">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <InputLabel htmlFor="make" value="Make" />
                                <TextInput
                                    id="make"
                                    value={data.make}
                                    onChange={(e) => setData('make', e.target.value)}
                                    placeholder="e.g., Honda, Yamaha, Kawasaki"
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
                                    placeholder="e.g., CBR600RR, R6, ZX-6R"
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
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <InputLabel htmlFor="category" value="Category" />
                                <Select
                                    id="category"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    options={bikeCategories}
                                    placeholder="Select category"
                                    className="mt-1"
                                />
                                <InputError message={errors.category} className="mt-2" />
                            </div>

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
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
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

                            <div>
                                <InputLabel htmlFor="plate_number" value="Plate Number (Optional)" />
                                <TextInput
                                    id="plate_number"
                                    value={data.plate_number}
                                    onChange={(e) => setData('plate_number', e.target.value)}
                                    placeholder="e.g., ABC 1234"
                                    className="mt-1"
                                />
                                <InputError message={errors.plate_number} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="notes" value="Notes (Optional)" />
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Any additional information about your bike..."
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

                        <div className="border-t border-secondary-200 dark:border-secondary-700 pt-6">
                            <Switch
                                checked={data.is_active}
                                onChange={(checked) => setData('is_active', checked)}
                                label="Set as primary bike"
                                description="This bike will be displayed as your main ride on your profile"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-4">
                            <Link href={route('garage.index')}>
                                <SecondaryButton type="button">
                                    Cancel
                                </SecondaryButton>
                            </Link>
                            <PrimaryButton type="submit" disabled={processing}>
                                {processing ? 'Adding...' : 'Add Bike'}
                            </PrimaryButton>
                        </div>
                    </form>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
