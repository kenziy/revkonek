import { Card, Badge } from '@/Components/UI';
import PhotoGallery from '@/Components/Vehicles/PhotoGallery';
import ModsList from '@/Components/Vehicles/ModsList';
import SocialLinks from '@/Components/Vehicles/SocialLinks';
import VehicleStory from '@/Components/Vehicles/VehicleStory';
import YouTubePlayer from '@/Components/Vehicles/YouTubePlayer';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

import type { Vehicle } from '@/types/vehicle';

interface TemplateProps {
    vehicle: Vehicle;
    isOwner: boolean;
    ownerIsPremium: boolean;
}

export default function ShowcaseLayout({ vehicle, isOwner, ownerIsPremium }: TemplateProps) {
    return (
        <div className="space-y-6">
            {/* Full-Width Hero Gallery with Overlay */}
            <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
                {vehicle.photos && vehicle.photos.length > 1 ? (
                    <PhotoGallery photos={vehicle.photos} alt={vehicle.displayName} />
                ) : (
                    <div className="aspect-[21/9] bg-secondary-100 dark:bg-secondary-800">
                        {vehicle.photo ? (
                            <img
                                src={vehicle.photo}
                                alt={vehicle.displayName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <span className="text-secondary-300 dark:text-secondary-600 text-8xl">🏍️</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Overlay with vehicle name */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-16 pointer-events-none">
                    <div className="flex items-end justify-between">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-white">
                                {vehicle.displayName}
                            </h1>
                            <div className="flex items-center gap-2 mt-2">
                                {vehicle.engineSpec && (
                                    <span className="text-white/80">{vehicle.engineSpec}</span>
                                )}
                                {vehicle.category && (
                                    <>
                                        <span className="text-white/50">&bull;</span>
                                        <span className="text-white/80">{vehicle.category.name}</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2 pointer-events-auto">
                            <Badge variant={vehicle.vehicleType.slug === 'bike' ? 'primary' : 'info'}>
                                {vehicle.vehicleType.name}
                            </Badge>
                            {vehicle.isActive && (
                                <Badge variant="primary">
                                    <StarIconSolid className="h-4 w-4 mr-1" />
                                    Primary
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Specs Card */}
            <Card variant="elevated" className="-mt-8 relative z-10">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    {vehicle.vehicleType.slug === 'bike' && vehicle.bikeDetails && (
                        <div>
                            <p className="text-2xl font-bold text-secondary-900 dark:text-white">{vehicle.bikeDetails.cc}</p>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400 uppercase tracking-wide">CC</p>
                        </div>
                    )}
                    {vehicle.vehicleType.slug === 'car' && vehicle.carDetails && (
                        <>
                            {vehicle.carDetails.horsepower && (
                                <div>
                                    <p className="text-2xl font-bold text-secondary-900 dark:text-white">{vehicle.carDetails.horsepower}</p>
                                    <p className="text-xs text-secondary-500 dark:text-secondary-400 uppercase tracking-wide">HP</p>
                                </div>
                            )}
                            {vehicle.carDetails.engineLiters && (
                                <div>
                                    <p className="text-2xl font-bold text-secondary-900 dark:text-white">{vehicle.carDetails.engineLiters}L</p>
                                    <p className="text-xs text-secondary-500 dark:text-secondary-400 uppercase tracking-wide">Engine</p>
                                </div>
                            )}
                            {vehicle.carDetails.transmissionLabel && (
                                <div>
                                    <p className="text-lg font-bold text-secondary-900 dark:text-white">{vehicle.carDetails.transmissionLabel}</p>
                                    <p className="text-xs text-secondary-500 dark:text-secondary-400 uppercase tracking-wide">Trans</p>
                                </div>
                            )}
                            {vehicle.carDetails.drivetrainLabel && (
                                <div>
                                    <p className="text-lg font-bold text-secondary-900 dark:text-white">{vehicle.carDetails.drivetrainLabel}</p>
                                    <p className="text-xs text-secondary-500 dark:text-secondary-400 uppercase tracking-wide">Drive</p>
                                </div>
                            )}
                        </>
                    )}
                    {vehicle.color && (
                        <div>
                            <p className="text-lg font-bold text-secondary-900 dark:text-white">{vehicle.color}</p>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400 uppercase tracking-wide">Color</p>
                        </div>
                    )}
                    <div>
                        <p className="text-lg font-bold text-secondary-900 dark:text-white capitalize">{vehicle.modificationLevel || 'Stock'}</p>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400 uppercase tracking-wide">Build</p>
                    </div>
                </div>
            </Card>

            {/* Story */}
            {vehicle.story && (
                <Card>
                    <VehicleStory story={vehicle.story} />
                </Card>
            )}

            {/* Mods & Social */}
            {vehicle.mods && vehicle.mods.length > 0 && (
                <Card>
                    <ModsList mods={vehicle.mods} vehicleUuid={vehicle.uuid} isOwner={isOwner} />
                </Card>
            )}

            {vehicle.socialLinks && vehicle.socialLinks.length > 0 && (
                <Card>
                    <SocialLinks links={vehicle.socialLinks} vehicleUuid={vehicle.uuid} isOwner={isOwner} />
                </Card>
            )}

            {vehicle.notes && (
                <Card>
                    <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Notes</dt>
                    <dd className="mt-1 text-secondary-900 dark:text-white whitespace-pre-wrap">{vehicle.notes}</dd>
                </Card>
            )}

            {/* Music player pinned at bottom */}
            {vehicle.youtubeVideoId && (
                <div className="fixed bottom-20 right-4 z-30">
                    <YouTubePlayer videoId={vehicle.youtubeVideoId} autoplay={vehicle.youtubeAutoplay} />
                </div>
            )}
        </div>
    );
}
