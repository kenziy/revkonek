import { Transition } from '@headlessui/react';
import { InertiaLinkProps, Link } from '@inertiajs/react';
import clsx from 'clsx';
import {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useState,
} from 'react';

const DropDownContext = createContext<{
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    toggleOpen: () => void;
}>({
    open: false,
    setOpen: () => {},
    toggleOpen: () => {},
});

const Dropdown = ({ children }: PropsWithChildren) => {
    const [open, setOpen] = useState(false);

    const toggleOpen = () => {
        setOpen((previousState) => !previousState);
    };

    return (
        <DropDownContext.Provider value={{ open, setOpen, toggleOpen }}>
            <div className="relative">{children}</div>
        </DropDownContext.Provider>
    );
};

const Trigger = ({ children }: PropsWithChildren) => {
    const { open, setOpen, toggleOpen } = useContext(DropDownContext);

    return (
        <>
            <div onClick={toggleOpen}>{children}</div>

            {open && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setOpen(false)}
                ></div>
            )}
        </>
    );
};

const Content = ({
    align = 'right',
    width = '48',
    contentClasses,
    children,
}: PropsWithChildren<{
    align?: 'left' | 'right';
    width?: '48' | '56' | '64';
    contentClasses?: string;
}>) => {
    const { open, setOpen } = useContext(DropDownContext);

    let alignmentClasses = 'origin-top';

    if (align === 'left') {
        alignmentClasses = 'ltr:origin-top-left rtl:origin-top-right start-0';
    } else if (align === 'right') {
        alignmentClasses = 'ltr:origin-top-right rtl:origin-top-left end-0';
    }

    const widthClasses = {
        '48': 'w-48',
        '56': 'w-56',
        '64': 'w-64',
    }[width];

    return (
        <>
            <Transition
                show={open}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div
                    className={clsx(
                        'absolute z-50 mt-2 rounded-xl shadow-soft-lg',
                        alignmentClasses,
                        widthClasses
                    )}
                    onClick={() => setOpen(false)}
                >
                    <div
                        className={clsx(
                            'rounded-xl py-1 ring-1 ring-black/5',
                            'bg-white dark:bg-secondary-800',
                            'dark:ring-white/10',
                            contentClasses
                        )}
                    >
                        {children}
                    </div>
                </div>
            </Transition>
        </>
    );
};

const DropdownLink = ({
    className = '',
    children,
    ...props
}: InertiaLinkProps) => {
    return (
        <Link
            {...props}
            className={clsx(
                'block w-full px-4 py-2.5 text-start text-sm',
                'transition-colors duration-150',
                'text-secondary-700 hover:bg-secondary-100',
                'dark:text-secondary-300 dark:hover:bg-secondary-700',
                'focus:outline-none focus:bg-secondary-100 dark:focus:bg-secondary-700',
                className
            )}
        >
            {children}
        </Link>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;
