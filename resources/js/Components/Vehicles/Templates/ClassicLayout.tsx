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

const modLevelLabels: Record<string, string> = {
    stock: 'Stock',
    mild: 'Mild',
    built: 'Built',
};

export default function ClassicLayout({ vehicle, isOwner, ownerIsPremium }: TemplateProps) {
    return (
        <div className="space-y-6">
            {/* Cover Banner */}
            {ownerIsPremium && vehicle.coverImage && (
                <Card padding="none" className="overflow-hidden">
                    <img
                        src={vehicle.coverImage}
                        alt={`${vehicle.displayName} cover`}
                        className="w-full h-48 object-cover"
                    />
                </Card>
            )}

            {/* Photo Section */}
            <Card padding="none" className="overflow-hidden">
                <div className="relative">
                    {ownerIsPremium && vehicle.photos && vehicle.photos.length > 1 ? (
                        <PhotoGallery photos={vehicle.photos} alt={vehicle.displayName} />
                    ) : (
                        <div className="aspect-video bg-secondary-100 dark:bg-secondary-800 relative">
                            {vehicle.photo ? (
                                <img
                                    src={vehicle.photo}
                                    alt={vehicle.displayName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <span className="text-secondary-300 dark:text-secondary-600 text-6xl">🏍️</span>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="absolute top-4 left-4 flex gap-2 z-10">
                        <Badge variant={vehicle.vehicleType.slug === 'bike' ? 'primary' : 'info'}>
                            {vehicle.vehicleType.name}
                        </Badge>
                    </div>
                    {vehicle.isActive && (
                        <Badge variant="primary" className="absolute top-4 right-4 z-10">
                            <StarIconSolid className="h-4 w-4 mr-1" />
                            Primary Vehicle
                        </Badge>
                    )}
                </div>
            </Card>

            {/* Details Section */}
            <Card>
                <div className="mb-6">
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

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-4">
                        {vehicle.category && (
                            <div>
                                <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Category</dt>
                                <dd className="mt-1 text-secondary-900 dark:text-white">{vehicle.category.name}</dd>
                            </div>
                        )}
                        <div>
                            <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Modification Level</dt>
                            <dd className="mt-1">
                                <Badge variant={vehicle.modificationLevel === 'built' ? 'warning' : vehicle.modificationLevel === 'mild' ? 'info' : 'secondary'}>
                                    {modLevelLabels[vehicle.modificationLevel || 'stock'] || vehicle.modificationLevel}
                                </Badge>
                            </dd>
                        </div>
                        {vehicle.color && (
                            <div>
                                <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Color</dt>
                                <dd className="mt-1 text-secondary-900 dark:text-white">{vehicle.color}</dd>
                            </div>
                        )}
                    </div>
                    <div className="space-y-4">
                        {vehicle.vehicleType.slug === 'bike' && vehicle.bikeDetails && (
                            <div>
                                <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Engine Displacement</dt>
                                <dd className="mt-1 text-secondary-900 dark:text-white">{vehicle.bikeDetails.cc}cc</dd>
                            </div>
                        )}
                        {vehicle.vehicleType.slug === 'car' && vehicle.carDetails && (
                            <>
                                {vehicle.carDetails.engineLiters && (
                                    <div>
                                        <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Engine Size</dt>
                                        <dd className="mt-1 text-secondary-900 dark:text-white">{vehicle.carDetails.engineLiters}L</dd>
                                    </div>
                                )}
                                {vehicle.carDetails.horsepower && (
                                    <div>
                                        <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Horsepower</dt>
                                        <dd className="mt-1 text-secondary-900 dark:text-white">{vehicle.carDetails.horsepower} hp</dd>
                                    </div>
                                )}
                                {vehicle.carDetails.transmissionLabel && (
                                    <div>
                                        <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Transmission</dt>
                                        <dd className="mt-1 text-secondary-900 dark:text-white">{vehicle.carDetails.transmissionLabel}</dd>
                                    </div>
                                )}
                                {vehicle.carDetails.drivetrainLabel && (
                                    <div>
                                        <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Drivetrain</dt>
                                        <dd className="mt-1 text-secondary-900 dark:text-white">{vehicle.carDetails.drivetrainLabel}</dd>
                                    </div>
                                )}
                                {vehicle.carDetails.doors && (
                                    <div>
                                        <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Doors</dt>
                                        <dd className="mt-1 text-secondary-900 dark:text-white">{vehicle.carDetails.doors}</dd>
                                    </div>
                                )}
                            </>
                        )}
                        {vehicle.plateNumber && (
                            <div>
                                <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Plate Number</dt>
                                <dd className="mt-1 text-secondary-900 dark:text-white">{vehicle.plateNumber}</dd>
                            </div>
                        )}
                    </div>
                </div>

                {vehicle.notes && (
                    <div className="mt-6 pt-6 border-t border-secondary-200 dark:border-secondary-700">
                        <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Notes</dt>
                        <dd className="mt-1 text-secondary-900 dark:text-white whitespace-pre-wrap">{vehicle.notes}</dd>
                    </div>
                )}
            </Card>

            {/* Pro Sections */}
            {ownerIsPremium && vehicle.story && (
                <Card>
                    <VehicleStory story={vehicle.story} />
                </Card>
            )}

            {ownerIsPremium && vehicle.mods && vehicle.mods.length > 0 && (
                <Card>
                    <ModsList mods={vehicle.mods} vehicleUuid={vehicle.uuid} isOwner={isOwner} />
                </Card>
            )}

            {ownerIsPremium && vehicle.socialLinks && vehicle.socialLinks.length > 0 && (
                <Card>
                    <SocialLinks links={vehicle.socialLinks} vehicleUuid={vehicle.uuid} isOwner={isOwner} />
                </Card>
            )}

            {ownerIsPremium && vehicle.youtubeVideoId && (
                <div className="fixed bottom-20 right-4 z-30">
                    <YouTubePlayer videoId={vehicle.youtubeVideoId} autoplay={vehicle.youtubeAutoplay} />
                </div>
            )}
        </div>
    );
}
