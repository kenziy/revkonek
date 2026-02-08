import clsx from 'clsx';
import { SparklesIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { Card } from '@/Components/UI';

interface UpgradePromptProps {
    feature: string;
    description?: string;
    className?: string;
}

export default function UpgradePrompt({ feature, description, className }: UpgradePromptProps) {
    return (
        <Card className={clsx('text-center py-8', className)}>
            <div className="flex justify-center mb-3">
                <div className="relative">
                    <SparklesIcon className="h-10 w-10 text-amber-400" />
                    <LockClosedIcon className="h-4 w-4 text-secondary-400 absolute -bottom-1 -right-1" />
                </div>
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-1">
                Upgrade to Pro
            </h3>
            <p className="text-secondary-500 dark:text-secondary-400 text-sm mb-4 max-w-sm mx-auto">
                {description || `Unlock ${feature} and more with a Pro subscription.`}
            </p>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium">
                <SparklesIcon className="h-4 w-4" />
                Go Pro
            </span>
        </Card>
    );
}
