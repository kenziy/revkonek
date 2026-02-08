import { router } from '@inertiajs/react';
import { useState } from 'react';
import FileUpload from '@/Components/Form/FileUpload';
import { TrashIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import type { VehiclePhoto } from '@/types/vehicle';

interface PhotoManagerProps {
    vehicleUuid: string;
    photos: VehiclePhoto[];
}

export default function PhotoManager({ vehicleUuid, photos }: PhotoManagerProps) {
    const [uploading, setUploading] = useState(false);

    const handleUpload = (files: File[]) => {
        if (files.length === 0) return;

        const formData = new FormData();
        files.forEach((file) => formData.append('photos[]', file));

        setUploading(true);
        router.post(route('vehicles.photos.store', vehicleUuid), formData, {
            forceFormData: true,
            onFinish: () => setUploading(false),
        });
    };

    const handleDelete = (photoId: number) => {
        router.delete(route('vehicles.photos.destroy', { vehicle: vehicleUuid, photo: photoId }));
    };

    const handleSetPrimary = (photoId: number) => {
        router.post(route('vehicles.photos.setPrimary', { vehicle: vehicleUuid, photo: photoId }));
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Upload Photos (max 10)
                </h3>
                <FileUpload
                    accept="image/*"
                    multiple
                    maxSize={5 * 1024 * 1024}
                    onChange={handleUpload}
                    disabled={uploading}
                />
            </div>

            {photos.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
                        Current Photos ({photos.length}/10)
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {photos.map((photo) => (
                            <div key={photo.id} className="relative group rounded-lg overflow-hidden">
                                <img
                                    src={photo.url}
                                    alt="Vehicle photo"
                                    className="w-full h-32 object-cover"
                                />
                                {photo.isPrimary && (
                                    <span className="absolute top-2 left-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-primary-500 text-white">
                                        <StarIconSolid className="h-3 w-3 mr-0.5" />
                                        Primary
                                    </span>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                    {!photo.isPrimary && (
                                        <button
                                            onClick={() => handleSetPrimary(photo.id)}
                                            className="p-1.5 rounded-full bg-white/90 text-secondary-700 hover:bg-white"
                                            title="Set as primary"
                                        >
                                            <StarIcon className="h-4 w-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(photo.id)}
                                        className="p-1.5 rounded-full bg-white/90 text-danger-600 hover:bg-white"
                                        title="Delete photo"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
