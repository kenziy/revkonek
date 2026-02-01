import {
    forwardRef,
    InputHTMLAttributes,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';
import clsx from 'clsx';

export default forwardRef(function TextInput(
    {
        type = 'text',
        className = '',
        isFocused = false,
        ...props
    }: InputHTMLAttributes<HTMLInputElement> & { isFocused?: boolean },
    ref,
) {
    const localRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={clsx(
                'w-full rounded-lg border px-4 py-3 text-sm transition-colors duration-200',
                'border-secondary-300 bg-white text-secondary-900',
                'placeholder:text-secondary-400',
                'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none',
                'dark:border-secondary-600 dark:bg-secondary-800 dark:text-secondary-100',
                'dark:placeholder:text-secondary-500',
                'dark:focus:border-primary-400 dark:focus:ring-primary-400/20',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                className
            )}
            ref={localRef}
        />
    );
});
