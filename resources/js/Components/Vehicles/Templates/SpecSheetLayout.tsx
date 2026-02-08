import { Card, Badge } from '@/Components/UI';
import PhotoGallery from '@/Components/Vehicles/PhotoGallery';
import ModsList from '@/Components/Vehicles/ModsList';
import SocialLinks from '@/Components/Vehicles/SocialLinks';
import YouTubePlayer from '@/Components/Vehicles/YouTubePlayer';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
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

export default function SpecSheetLayout({ vehicle, isOwner, ownerIsPremium }: TemplateProps) {
    const totalInvestment = vehicle.mods?.reduce((sum, mod) => sum + (parseFloat(mod.price || '0') || 0), 0) || 0;

    return (
        <div className="space-y-6">
            {/* Header with Name and Badges */}
            <Card>
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
                            {vehicle.displayName}
                        </h1>
                        <p className="text-secondary-500 dark:text-secondary-400 mt-1">
                            {vehicle.engineSpec} {vehicle.category ? `• ${vehicle.category.name}` : ''}
                        </p>
                    </div>
                    <div className="flex gap-2">
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
            </Card>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Specs Table — 2 columns wide */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <h2 className="text-lg font-semibold text-secondary-900 dark:text-white flex items-center gap-2 mb-4">
                            <ClipboardDocumentListIcon className="h-5 w-5" />
                            Specifications
                        </h2>
                        <table className="w-full">
                            <tbody className="divide-y divide-secondary-100 dark:divide-secondary-700">
                                <tr>
                                    <td className="py-2.5 text-sm text-secondary-500 dark:text-secondary-400 w-1/3">Make</td>
                                    <td className="py-2.5 text-sm font-medium text-secondary-900 dark:text-white">{vehicle.make}</td>
                                </tr>
                                <tr>
                                    <td className="py-2.5 text-sm text-secondary-500 dark:text-secondary-400">Model</td>
                                    <td className="py-2.5 text-sm font-medium text-secondary-900 dark:text-white">{vehicle.model}</td>
                                </tr>
                                <tr>
                                    <td className="py-2.5 text-sm text-secondary-500 dark:text-secondary-400">Year</td>
                                    <td className="py-2.5 text-sm font-medium text-secondary-900 dark:text-white">{vehicle.year}</td>
                                </tr>
                                {vehicle.vehicleType.slug === 'bike' && vehicle.bikeDetails && (
                                    <tr>
                                        <td className="py-2.5 text-sm text-secondary-500 dark:text-secondary-400">Displacement</td>
                                        <td className="py-2.5 text-sm font-medium text-secondary-900 dark:text-white">{vehicle.bikeDetails.cc}cc</td>
                                    </tr>
                                )}
                                {vehicle.vehicleType.slug === 'car' && vehicle.carDetails && (
                                    <>
                                        {vehicle.carDetails.engineLiters && (
                                            <tr>
                                                <td className="py-2.5 text-sm text-secondary-500 dark:text-secondary-400">Engine</td>
                                                <td className="py-2.5 text-sm font-medium text-secondary-900 dark:text-white">{vehicle.carDetails.engineLiters}L</td>
                                            </tr>
                                        )}
                                        {vehicle.carDetails.horsepower && (
                                            <tr>
                                                <td className="py-2.5 text-sm text-secondary-500 dark:text-secondary-400">Power</td>
                                                <td className="py-2.5 text-sm font-medium text-secondary-900 dark:text-white">{vehicle.carDetails.horsepower} hp</td>
                                            </tr>
                                        )}
                                        {vehicle.carDetails.transmissionLabel && (
                                            <tr>
                                                <td className="py-2.5 text-sm text-secondary-500 dark:text-secondary-400">Transmission</td>
                                                <td className="py-2.5 text-sm font-medium text-secondary-900 dark:text-white">{vehicle.carDetails.transmissionLabel}</td>
                                            </tr>
                                        )}
                                        {vehicle.carDetails.drivetrainLabel && (
                                            <tr>
                                                <td className="py-2.5 text-sm text-secondary-500 dark:text-secondary-400">Drivetrain</td>
                                                <td className="py-2.5 text-sm font-medium text-secondary-900 dark:text-white">{vehicle.carDetails.drivetrainLabel}</td>
                                            </tr>
                                        )}
                                        {vehicle.carDetails.doors && (
                                            <tr>
                                                <td className="py-2.5 text-sm text-secondary-500 dark:text-secondary-400">Doors</td>
                                                <td className="py-2.5 text-sm font-medium text-secondary-900 dark:text-white">{vehicle.carDetails.doors}</td>
                                            </tr>
                                        )}
                                    </>
                                )}
                                {vehicle.color && (
                                    <tr>
                                        <td className="py-2.5 text-sm text-secondary-500 dark:text-secondary-400">Color</td>
                                        <td className="py-2.5 text-sm font-medium text-secondary-900 dark:text-white">{vehicle.color}</td>
                                    </tr>
                                )}
                                <tr>
                                    <td className="py-2.5 text-sm text-secondary-500 dark:text-secondary-400">Build Level</td>
                                    <td className="py-2.5">
                                        <Badge variant={vehicle.modificationLevel === 'built' ? 'warning' : vehicle.modificationLevel === 'mild' ? 'info' : 'secondary'}>
                                            {modLevelLabels[vehicle.modificationLevel || 'stock']}
                                        </Badge>
                                    </td>
                                </tr>
                                {vehicle.plateNumber && (
                                    <tr>
                                        <td className="py-2.5 text-sm text-secondary-500 dark:text-secondary-400">Plate</td>
                                        <td className="py-2.5 text-sm font-medium text-secondary-900 dark:text-white">{vehicle.plateNumber}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </Card>

                    {/* Mods with total investment */}
                    {vehicle.mods && vehicle.mods.length > 0 && (
                        <Card>
                            <ModsList mods={vehicle.mods} vehicleUuid={vehicle.uuid} isOwner={isOwner} />
                            {totalInvestment > 0 && (
                                <div className="mt-4 pt-4 border-t border-secondary-200 dark:border-secondary-700 text-right">
                                    <span className="text-sm text-secondary-500 dark:text-secondary-400">Total Investment: </span>
                                    <span className="text-lg font-bold text-secondary-900 dark:text-white">
                                        ₱{totalInvestment.toLocaleString()}
                                    </span>
                                </div>
                            )}
                        </Card>
                    )}
                </div>

                {/* Sidebar — compact gallery + links */}
                <div className="space-y-6">
                    <Card padding="none" className="overflow-hidden">
                        {vehicle.photos && vehicle.photos.length > 1 ? (
                            <PhotoGallery photos={vehicle.photos} alt={vehicle.displayName} />
                        ) : (
                            <div className="aspect-square bg-secondary-100 dark:bg-secondary-800">
                                {vehicle.photo ? (
                                    <img src={vehicle.photo} alt={vehicle.displayName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <span className="text-secondary-300 dark:text-secondary-600 text-4xl">🏍️</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>

                    {vehicle.notes && (
                        <Card>
                            <dt className="text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-1">Notes</dt>
                            <dd className="text-sm text-secondary-900 dark:text-white whitespace-pre-wrap">{vehicle.notes}</dd>
                        </Card>
                    )}

                    {vehicle.story && (
                        <Card>
                            <h3 className="text-sm font-semibold text-secondary-900 dark:text-white mb-2">Build Story</h3>
                            <p className="text-sm text-secondary-700 dark:text-secondary-300 whitespace-pre-wrap line-clamp-6">
                                {vehicle.story}
                            </p>
                        </Card>
                    )}

                    {vehicle.socialLinks && vehicle.socialLinks.length > 0 && (
                        <Card>
                            <SocialLinks links={vehicle.socialLinks} vehicleUuid={vehicle.uuid} isOwner={isOwner} />
                        </Card>
                    )}
                </div>
            </div>

            {/* Music player */}
            {vehicle.youtubeVideoId && (
                <div className="fixed bottom-20 right-4 z-30">
                    <YouTubePlayer videoId={vehicle.youtubeVideoId} autoplay={vehicle.youtubeAutoplay} />
                </div>
            )}
        </div>
    );
}
