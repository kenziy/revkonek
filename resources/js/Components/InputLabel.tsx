import { LabelHTMLAttributes } from 'react';
import clsx from 'clsx';

export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { value?: string }) {
    return (
        <label
            {...props}
            className={clsx(
                'block text-sm font-medium',
                'text-secondary-700 dark:text-secondary-300',
                className
            )}
        >
            {value ? value : children}
        </label>
    );
}
