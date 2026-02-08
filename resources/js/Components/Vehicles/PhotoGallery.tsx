import { useState } from 'react';
import clsx from 'clsx';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { TruckIcon } from '@heroicons/react/24/outline';
import type { VehiclePhoto } from '@/types/vehicle';

interface PhotoGalleryProps {
    photos: VehiclePhoto[];
    alt: string;
    className?: string;
}

export default function PhotoGallery({ photos, alt, className }: PhotoGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    if (!photos || photos.length === 0) {
        return (
            <div className={clsx('aspect-video bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center', className)}>
                <TruckIcon className="h-20 w-20 text-secondary-300 dark:text-secondary-600" />
            </div>
        );
    }

    const goTo = (index: number) => {
        setActiveIndex((index + photos.length) % photos.length);
    };

    return (
        <>
            <div className={clsx('relative group', className)}>
                {/* Main Image */}
                <div
                    className="aspect-video bg-secondary-100 dark:bg-secondary-800 cursor-pointer overflow-hidden"
                    onClick={() => setLightboxOpen(true)}
                >
                    <img
                        src={photos[activeIndex].url}
                        alt={`${alt} - Photo ${activeIndex + 1}`}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Navigation arrows */}
                {photos.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); goTo(activeIndex - 1); }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronLeftIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); goTo(activeIndex + 1); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronRightIcon className="h-5 w-5" />
                        </button>
                    </>
                )}

                {/* Dot indicators */}
                {photos.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {photos.map((_, i) => (
                            <button
                                key={i}
                                onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                                className={clsx(
                                    'w-2 h-2 rounded-full transition-all',
                                    i === activeIndex
                                        ? 'bg-white scale-110'
                                        : 'bg-white/50 hover:bg-white/75'
                                )}
                            />
                        ))}
                    </div>
                )}

                {/* Thumbnail strip */}
                {photos.length > 1 && (
                    <div className="flex gap-1 mt-1 overflow-x-auto pb-1">
                        {photos.map((photo, i) => (
                            <button
                                key={photo.id}
                                onClick={() => setActiveIndex(i)}
                                className={clsx(
                                    'flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all',
                                    i === activeIndex
                                        ? 'border-primary-500'
                                        : 'border-transparent opacity-60 hover:opacity-100'
                                )}
                            >
                                <img
                                    src={photo.url}
                                    alt={`Thumbnail ${i + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Fullscreen Lightbox */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
                    onClick={() => setLightboxOpen(false)}
                >
                    <button
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 z-10"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>

                    {photos.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); goTo(activeIndex - 1); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
                            >
                                <ChevronLeftIcon className="h-8 w-8" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); goTo(activeIndex + 1); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
                            >
                                <ChevronRightIcon className="h-8 w-8" />
                            </button>
                        </>
                    )}

                    <img
                        src={photos[activeIndex].url}
                        alt={`${alt} - Photo ${activeIndex + 1}`}
                        className="max-h-[90vh] max-w-[90vw] object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                        {activeIndex + 1} / {photos.length}
                    </div>
                </div>
            )}
        </>
    );
}
