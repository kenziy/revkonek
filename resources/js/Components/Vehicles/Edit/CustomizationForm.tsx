import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import Textarea from '@/Components/Form/Textarea';
import FileUpload from '@/Components/Form/FileUpload';
import Switch from '@/Components/Form/Switch';
import PrimaryButton from '@/Components/PrimaryButton';
import clsx from 'clsx';
import type { VehicleLayoutTemplate, BackgroundStyle } from '@/types/vehicle';

interface CustomizationFormProps {
    vehicleUuid: string;
    layoutTemplate?: VehicleLayoutTemplate;
    accentColor?: string;
    backgroundStyle?: BackgroundStyle;
    story?: string;
    coverImage?: string;
    youtubeUrl?: string;
    youtubeAutoplay?: boolean;
}

const templates: { value: VehicleLayoutTemplate; label: string; description: string }[] = [
    { value: 'classic', label: 'Classic', description: 'Card-based layout with details below gallery' },
    { value: 'showcase', label: 'Showcase', description: 'Full-width hero with floating specs card' },
    { value: 'spec_sheet', label: 'Spec Sheet', description: 'Data-focused with specs table and sidebar' },
];

const backgroundStyles: { value: BackgroundStyle; label: string }[] = [
    { value: 'default', label: 'Default' },
    { value: 'gradient', label: 'Gradient' },
    { value: 'dark', label: 'Dark' },
    { value: 'light', label: 'Light' },
];

export default function CustomizationForm({
    vehicleUuid,
    layoutTemplate = 'classic',
    accentColor = '',
    backgroundStyle = 'default',
    story = '',
    coverImage,
    youtubeUrl = '',
    youtubeAutoplay = false,
}: CustomizationFormProps) {
    const { data, setData, put, processing, errors } = useForm({
        layout_template: layoutTemplate,
        accent_color: accentColor || '',
        background_style: backgroundStyle,
        story: story || '',
        youtube_url: youtubeUrl || '',
        youtube_autoplay: youtubeAutoplay,
        cover_image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('vehicles.customization.update', vehicleUuid), {
            forceFormData: true,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Layout Template Picker */}
            <div>
                <InputLabel value="Layout Template" />
                <div className="grid gap-3 sm:grid-cols-3 mt-2">
                    {templates.map((tpl) => (
                        <button
                            key={tpl.value}
                            type="button"
                            onClick={() => setData('layout_template', tpl.value)}
                            className={clsx(
                                'p-3 rounded-lg border-2 text-left transition-all',
                                data.layout_template === tpl.value
                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                    : 'border-secondary-200 dark:border-secondary-700 hover:border-secondary-300'
                            )}
                        >
                            <p className="font-medium text-secondary-900 dark:text-white text-sm">{tpl.label}</p>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">{tpl.description}</p>
                        </button>
                    ))}
                </div>
                <InputError message={errors.layout_template} className="mt-2" />
            </div>

            {/* Accent Color */}
            <div>
                <InputLabel htmlFor="accent_color" value="Accent Color" />
                <div className="flex items-center gap-3 mt-1">
                    <input
                        type="color"
                        id="accent_color"
                        value={data.accent_color || '#6366f1'}
                        onChange={(e) => setData('accent_color', e.target.value)}
                        className="h-10 w-14 rounded border border-secondary-300 dark:border-secondary-600 cursor-pointer"
                    />
                    <TextInput
                        value={data.accent_color}
                        onChange={(e) => setData('accent_color', e.target.value)}
                        placeholder="#6366f1"
                        className="w-32"
                    />
                    {data.accent_color && (
                        <button
                            type="button"
                            onClick={() => setData('accent_color', '')}
                            className="text-sm text-secondary-500 hover:text-secondary-700"
                        >
                            Clear
                        </button>
                    )}
                </div>
                <InputError message={errors.accent_color} className="mt-2" />
            </div>

            {/* Background Style */}
            <div>
                <InputLabel value="Background Style" />
                <div className="flex flex-wrap gap-2 mt-2">
                    {backgroundStyles.map((style) => (
                        <button
                            key={style.value}
                            type="button"
                            onClick={() => setData('background_style', style.value)}
                            className={clsx(
                                'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                                data.background_style === style.value
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200'
                            )}
                        >
                            {style.label}
                        </button>
                    ))}
                </div>
                <InputError message={errors.background_style} className="mt-2" />
            </div>

            {/* Cover Image */}
            <div>
                <InputLabel value="Cover Banner Image" />
                {coverImage && (
                    <img src={coverImage} alt="Current cover" className="w-full h-32 object-cover rounded-lg mt-1 mb-2" />
                )}
                <FileUpload
                    accept="image/*"
                    maxSize={10 * 1024 * 1024}
                    onChange={(files) => setData('cover_image', files[0] || null)}
                    className="mt-1"
                />
                <InputError message={errors.cover_image} className="mt-2" />
            </div>

            {/* YouTube URL */}
            <div>
                <InputLabel htmlFor="youtube_url" value="YouTube Background Music URL" />
                <TextInput
                    id="youtube_url"
                    value={data.youtube_url}
                    onChange={(e) => setData('youtube_url', e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="mt-1"
                />
                <p className="text-xs text-secondary-500 mt-1">Supports youtube.com/watch, youtu.be, and embed URLs</p>
                <InputError message={errors.youtube_url} className="mt-2" />

                <div className="mt-3">
                    <Switch
                        checked={data.youtube_autoplay}
                        onChange={(checked) => setData('youtube_autoplay', checked)}
                        label="Auto-play (muted)"
                        description="Music will start playing automatically when someone visits your vehicle page"
                    />
                </div>
            </div>

            {/* Story */}
            <div>
                <InputLabel htmlFor="story" value="Build Story" />
                <Textarea
                    id="story"
                    value={data.story}
                    onChange={(e) => setData('story', e.target.value)}
                    placeholder="Share the story behind your build..."
                    rows={6}
                    className="mt-1"
                />
                <p className="text-xs text-secondary-500 mt-1">{data.story.length}/5000 characters</p>
                <InputError message={errors.story} className="mt-2" />
            </div>

            <div className="flex justify-end">
                <PrimaryButton type="submit" disabled={processing}>
                    {processing ? 'Saving...' : 'Save Customization'}
                </PrimaryButton>
            </div>
        </form>
    );
}
