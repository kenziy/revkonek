import { createContext, useContext, useState, ReactNode } from 'react';
import clsx from 'clsx';

interface TabsContextType {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

function useTabs() {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error('Tabs components must be used within a Tabs provider');
    }
    return context;
}

interface TabsProps {
    defaultValue: string;
    children: ReactNode;
    onChange?: (value: string) => void;
    className?: string;
}

export default function Tabs({
    defaultValue,
    children,
    onChange,
    className,
}: TabsProps) {
    const [activeTab, setActiveTabState] = useState(defaultValue);

    const setActiveTab = (tab: string) => {
        setActiveTabState(tab);
        onChange?.(tab);
    };

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={className}>{children}</div>
        </TabsContext.Provider>
    );
}

interface TabsListProps {
    children: ReactNode;
    variant?: 'default' | 'pills' | 'underline';
    fullWidth?: boolean;
    className?: string;
}

Tabs.List = function TabsList({
    children,
    variant = 'default',
    fullWidth = false,
    className,
}: TabsListProps) {
    const variantClasses = {
        default: 'bg-secondary-100 dark:bg-secondary-800 rounded-lg p-1',
        pills: 'gap-2',
        underline: 'border-b border-secondary-200 dark:border-secondary-700',
    };

    return (
        <div
            className={clsx(
                'flex',
                fullWidth ? 'w-full' : 'w-fit',
                variantClasses[variant],
                className
            )}
            role="tablist"
        >
            {children}
        </div>
    );
};

interface TabsTriggerProps {
    value: string;
    children: ReactNode;
    disabled?: boolean;
    className?: string;
}

Tabs.Trigger = function TabsTrigger({
    value,
    children,
    disabled = false,
    className,
}: TabsTriggerProps) {
    const { activeTab, setActiveTab } = useTabs();
    const isActive = activeTab === value;

    return (
        <button
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={disabled}
            onClick={() => setActiveTab(value)}
            className={clsx(
                'flex-1 px-4 py-2 text-sm font-medium rounded-md',
                'transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                isActive
                    ? 'bg-white text-secondary-900 shadow-sm dark:bg-secondary-700 dark:text-white'
                    : 'text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white',
                disabled && 'opacity-50 cursor-not-allowed',
                className
            )}
        >
            {children}
        </button>
    );
};

interface TabsContentProps {
    value: string;
    children: ReactNode;
    className?: string;
}

Tabs.Content = function TabsContent({
    value,
    children,
    className,
}: TabsContentProps) {
    const { activeTab } = useTabs();

    if (activeTab !== value) return null;

    return (
        <div
            role="tabpanel"
            className={clsx('animate-fade-in', className)}
        >
            {children}
        </div>
    );
};
