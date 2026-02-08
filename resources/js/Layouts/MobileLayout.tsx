import { PropsWithChildren, ReactNode, useState } from 'react';
import { usePage } from '@inertiajs/react';
import clsx from 'clsx';
import TopBar from '@/Components/UI/TopBar';
import BottomNav from '@/Components/UI/BottomNav';

interface MobileLayoutProps extends PropsWithChildren {
    title?: string;
    showTopBar?: boolean;
    showBottomNav?: boolean;
    showLogo?: boolean;
    leftAction?: ReactNode;
    rightActions?: ReactNode;
    transparentHeader?: boolean;
    className?: string;
}

export default function MobileLayout({
    children,
    title,
    showTopBar = true,
    showBottomNav = true,
    showLogo = true,
    leftAction,
    rightActions,
    transparentHeader = false,
    className,
}: MobileLayoutProps) {
    const { auth } = usePage().props as any;
    const user = auth?.user;

    return (
        <div
            className={clsx(
                'min-h-screen bg-secondary-50 dark:bg-secondary-900',
                'transition-colors duration-200'
            )}
        >
            {showTopBar && (
                <TopBar
                    user={user}
                    title={title}
                    showLogo={showLogo}
                    leftAction={leftAction}
                    rightActions={rightActions}
                    transparent={transparentHeader}
                    notificationCount={0}
                />
            )}

            <main
                className={clsx(
                    'min-h-screen',
                    showTopBar && 'pt-14',
                    showBottomNav && 'pb-20',
                    className
                )}
            >
                {children}
            </main>

            {showBottomNav && (
                <BottomNav
                    currentRoute={route().current() || ''}
                />
            )}
        </div>
    );
}
