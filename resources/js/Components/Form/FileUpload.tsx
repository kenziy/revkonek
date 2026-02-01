import { useRef, useState, ChangeEvent } from 'react';
import clsx from 'clsx';
import { CloudArrowUpIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface FileUploadProps {
    accept?: string;
    multiple?: boolean;
    maxSize?: number;
    onChange: (files: File[]) => void;
    preview?: boolean;
    disabled?: boolean;
    error?: string;
    className?: string;
}

export default function FileUpload({
    accept = 'image/*',
    multiple = false,
    maxSize = 5 * 1024 * 1024,
    onChange,
    preview = true,
    disabled = false,
    error,
    className,
}: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const handleFiles = (newFiles: FileList | null) => {
        if (!newFiles) return;

        const validFiles: File[] = [];
        const newPreviews: string[] = [];

        Array.from(newFiles).forEach((file) => {
            if (file.size > maxSize) {
                setLocalError(`File "${file.name}" exceeds ${maxSize / 1024 / 1024}MB limit`);
                return;
            }
            validFiles.push(file);

            if (preview && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    newPreviews.push(e.target?.result as string);
                    if (newPreviews.length === validFiles.filter(f => f.type.startsWith('image/')).length) {
                        setPreviews(multiple ? [...previews, ...newPreviews] : newPreviews);
                    }
                };
                reader.readAsDataURL(file);
            }
        });

        if (validFiles.length > 0) {
            setLocalError(null);
            const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
            setFiles(updatedFiles);
            onChange(updatedFiles);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
    };

    const removeFile = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        setFiles(newFiles);
        setPreviews(newPreviews);
        onChange(newFiles);
    };

    const displayError = error || localError;

    return (
        <div className={className}>
            <div
                onClick={() => !disabled && inputRef.current?.click()}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={!disabled ? handleDrop : undefined}
                className={clsx(
                    'relative flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed',
                    'transition-colors duration-200 cursor-pointer',
                    dragActive
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : [
                              'border-secondary-300 dark:border-secondary-600',
                              'hover:border-primary-400 hover:bg-secondary-50',
                              'dark:hover:bg-secondary-800/50',
                          ],
                    disabled && 'opacity-50 cursor-not-allowed',
                    displayError && 'border-danger-500'
                )}
            >
                <CloudArrowUpIcon className="h-10 w-10 text-secondary-400 mb-3" />
                <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                    Drop files here or click to upload
                </p>
                <p className="text-xs text-secondary-500 mt-1">
                    Max size: {maxSize / 1024 / 1024}MB
                </p>
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleChange}
                    disabled={disabled}
                    className="hidden"
                />
            </div>

            {displayError && (
                <p className="mt-2 text-sm text-danger-600 dark:text-danger-400">
                    {displayError}
                </p>
            )}

            {preview && previews.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                    {previews.map((src, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={src}
                                alt={`Preview ${index + 1}`}
                                className="h-24 w-full object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className={clsx(
                                    'absolute top-1 right-1 p-1 rounded-full',
                                    'bg-black/50 text-white',
                                    'opacity-0 group-hover:opacity-100',
                                    'transition-opacity duration-200'
                                )}
                            >
                                <XMarkIcon className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {!preview && files.length > 0 && (
                <ul className="mt-4 space-y-2">
                    {files.map((file, index) => (
                        <li
                            key={index}
                            className="flex items-center justify-between p-2 rounded-lg bg-secondary-50 dark:bg-secondary-800"
                        >
                            <div className="flex items-center gap-2">
                                <PhotoIcon className="h-5 w-5 text-secondary-400" />
                                <span className="text-sm text-secondary-700 dark:text-secondary-300 truncate max-w-[200px]">
                                    {file.name}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="p-1 text-secondary-400 hover:text-danger-500"
                            >
                                <XMarkIcon className="h-4 w-4" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
