import { TextareaHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: boolean;
    resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export default forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
    {
        error = false,
        resize = 'vertical',
        className,
        ...props
    },
    ref
) {
    const resizeClasses = {
        none: 'resize-none',
        vertical: 'resize-y',
        horizontal: 'resize-x',
        both: 'resize',
    };

    return (
        <textarea
            ref={ref}
            className={clsx(
                'w-full rounded-lg border px-4 py-3 text-sm',
                'transition-colors duration-200',
                'focus:outline-none focus:ring-2',
                error
                    ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20'
                    : [
                          'border-secondary-300 bg-white text-secondary-900',
                          'placeholder:text-secondary-400',
                          'focus:border-primary-500 focus:ring-primary-500/20',
                          'dark:border-secondary-600 dark:bg-secondary-800 dark:text-secondary-100',
                          'dark:placeholder:text-secondary-500',
                          'dark:focus:border-primary-400 dark:focus:ring-primary-400/20',
                      ],
                'disabled:opacity-50 disabled:cursor-not-allowed',
                resizeClasses[resize],
                className
            )}
            {...props}
        />
    );
});
