import { HTMLAttributes } from 'react';
import clsx from 'clsx';

export default function InputError({
    message,
    className = '',
    ...props
}: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
    return message ? (
        <p
            {...props}
            className={clsx(
                'text-sm',
                'text-danger-600 dark:text-danger-400',
                className
            )}
        >
            {message}
        </p>
    ) : null;
}
