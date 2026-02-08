import { Link } from '@inertiajs/react';
import clsx from 'clsx';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[];
    from: number;
    to: number;
    total: number;
}

export default function Pagination({ links, from, to, total }: PaginationProps) {
    if (links.length <= 3) return null;

    return (
        <div className="flex items-center justify-between px-4 py-3">
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Showing <span className="font-medium">{from}</span> to{' '}
                <span className="font-medium">{to}</span> of{' '}
                <span className="font-medium">{total}</span> results
            </p>
            <nav className="flex items-center gap-1">
                {links.map((link, index) => (
                    <span key={index}>
                        {link.url ? (
                            <Link
                                href={link.url}
                                className={clsx(
                                    'inline-flex items-center px-3 py-1.5 text-sm rounded-lg transition-colors',
                                    link.active
                                        ? 'bg-primary-600 text-white'
                                        : 'text-secondary-600 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:bg-secondary-700'
                                )}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                preserveScroll
                            />
                        ) : (
                            <span
                                className="inline-flex items-center px-3 py-1.5 text-sm text-secondary-400 dark:text-secondary-600"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        )}
                    </span>
                ))}
            </nav>
        </div>
    );
}
