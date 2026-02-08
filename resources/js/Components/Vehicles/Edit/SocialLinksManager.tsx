import { useForm, router } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import Select from '@/Components/Form/Select';
import PrimaryButton from '@/Components/PrimaryButton';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import type { VehicleSocialLink, SocialPlatform } from '@/types/vehicle';

interface SocialLinksManagerProps {
    vehicleUuid: string;
    socialLinks: VehicleSocialLink[];
}

const platformOptions: { value: SocialPlatform; label: string }[] = [
    { value: 'youtube', label: 'YouTube' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'X / Twitter' },
    { value: 'website', label: 'Website' },
];

const platformIcons: Record<string, string> = {
    youtube: '🎬',
    instagram: '📸',
    tiktok: '🎵',
    facebook: '👥',
    twitter: '🐦',
    website: '🌐',
};

export default function SocialLinksManager({ vehicleUuid, socialLinks }: SocialLinksManagerProps) {
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        platform: 'instagram' as SocialPlatform,
        url: '',
        label: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('vehicles.socialLinks.store', vehicleUuid), {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    const handleDelete = (linkId: number) => {
        router.delete(route('vehicles.socialLinks.destroy', { vehicle: vehicleUuid, link: linkId }));
    };

    return (
        <div className="space-y-4">
            {/* Existing links */}
            {socialLinks.length > 0 && (
                <div className="space-y-2">
                    {socialLinks.map((link) => (
                        <div
                            key={link.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-secondary-50 dark:bg-secondary-800/50"
                        >
                            <div className="flex items-center gap-2">
                                <span>{platformIcons[link.platform] || '🔗'}</span>
                                <div>
                                    <p className="font-medium text-secondary-900 dark:text-white text-sm">
                                        {link.label || link.platformLabel}
                                    </p>
                                    <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate max-w-xs">
                                        {link.url}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(link.id)}
                                className="p-1 text-secondary-400 hover:text-danger-500"
                            >
                                <TrashIcon className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Add link form */}
            {showForm ? (
                <form onSubmit={handleSubmit} className="p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg space-y-4">
                    <div>
                        <InputLabel htmlFor="link_platform" value="Platform" />
                        <Select
                            id="link_platform"
                            value={data.platform}
                            onChange={(e) => setData('platform', e.target.value as SocialPlatform)}
                            options={platformOptions}
                            className="mt-1"
                        />
                        <InputError message={errors.platform} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="link_url" value="URL" />
                        <TextInput
                            id="link_url"
                            type="url"
                            value={data.url}
                            onChange={(e) => setData('url', e.target.value)}
                            placeholder="https://..."
                            className="mt-1"
                            required
                        />
                        <InputError message={errors.url} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="link_label" value="Display Label (Optional)" />
                        <TextInput
                            id="link_label"
                            value={data.label}
                            onChange={(e) => setData('label', e.target.value)}
                            placeholder="e.g., My Build Channel"
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
                            {processing ? 'Adding...' : 'Add Link'}
                        </PrimaryButton>
                    </div>
                </form>
            ) : (
                <button
                    onClick={() => setShowForm(true)}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-secondary-300 dark:border-secondary-600 text-secondary-500 dark:text-secondary-400 hover:border-primary-400 hover:text-primary-500 transition-colors"
                >
                    <PlusIcon className="h-5 w-5" />
                    Add Social Link
                </button>
            )}
        </div>
    );
}
