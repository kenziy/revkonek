import { router } from '@inertiajs/react';
import { TrashIcon, GlobeAltIcon, LinkIcon } from '@heroicons/react/24/outline';
import type { VehicleSocialLink } from '@/types/vehicle';

interface SocialLinksProps {
    links: VehicleSocialLink[];
    vehicleUuid: string;
    isOwner?: boolean;
    className?: string;
}

const platformIcons: Record<string, string> = {
    youtube: '🎬',
    instagram: '📸',
    tiktok: '🎵',
    facebook: '👥',
    twitter: '🐦',
    website: '🌐',
};

export default function SocialLinks({ links, vehicleUuid, isOwner = false, className }: SocialLinksProps) {
    if (!links || links.length === 0) return null;

    const handleDelete = (linkId: number) => {
        router.delete(route('vehicles.socialLinks.destroy', { vehicle: vehicleUuid, link: linkId }));
    };

    return (
        <div className={className}>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white flex items-center gap-2 mb-3">
                <LinkIcon className="h-5 w-5" />
                Links
            </h3>
            <div className="flex flex-wrap gap-2">
                {links.map((link) => (
                    <div key={link.id} className="flex items-center gap-1">
                        <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-colors text-sm"
                        >
                            <span>{platformIcons[link.platform] || '🔗'}</span>
                            <span>{link.label || link.platformLabel}</span>
                        </a>
                        {isOwner && (
                            <button
                                onClick={() => handleDelete(link.id)}
                                className="p-1 text-secondary-400 hover:text-danger-500 transition-colors"
                            >
                                <TrashIcon className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
