import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useTheme } from '@/Contexts/ThemeContext';

interface ThemeToggleProps {
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export default function ThemeToggle({ size = 'md', showLabel = false }: ThemeToggleProps) {
    const { theme, toggleTheme, isDark } = useTheme();

    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
    };

    const iconSizes = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
    };

    return (
        <button
            onClick={toggleTheme}
            className={clsx(
                'flex items-center justify-center rounded-full',
                'text-secondary-600 hover:bg-secondary-100',
                'dark:text-secondary-400 dark:hover:bg-secondary-800',
                'transition-all duration-200',
                sizeClasses[size]
            )}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDark ? (
                <SunIcon className={clsx(iconSizes[size], 'text-accent-400')} />
            ) : (
                <MoonIcon className={iconSizes[size]} />
            )}
            {showLabel && (
                <span className="ml-2 text-sm font-medium">
                    {isDark ? 'Light' : 'Dark'}
                </span>
            )}
        </button>
    );
}
