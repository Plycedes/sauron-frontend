'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface StatCardProps {
    label: string;
    value: string | number;
    icon?: ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    /** Highlight this card visually (used for streak / hero stats). */
    highlighted?: boolean;
}

const TREND_STYLES: Record<NonNullable<StatCardProps['trend']>, { arrow: string; color: string }> = {
    up: { arrow: '↑', color: 'text-green-600' },
    down: { arrow: '↓', color: 'text-red-600' },
    neutral: { arrow: '→', color: 'text-gray-500' },
};

export function StatCard({ label, value, icon, trend, highlighted }: StatCardProps) {
    const trendStyle = trend ? TREND_STYLES[trend] : null;

    return (
        <div
            className={cn(
                'rounded-lg border bg-white p-6 shadow-sm',
                highlighted ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-200',
            )}
        >
            <div className="flex items-start justify-between">
                <p className="text-sm font-medium text-gray-600">{label}</p>
                {icon && (
                    <span
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600"
                        aria-hidden
                    >
                        {icon}
                    </span>
                )}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
                <p
                    className={cn(
                        'font-semibold text-gray-900',
                        highlighted ? 'text-4xl' : 'text-3xl',
                    )}
                >
                    {value}
                </p>
                {trendStyle && (
                    <span className={cn('text-sm font-medium', trendStyle.color)}>
                        {trendStyle.arrow}
                    </span>
                )}
            </div>
        </div>
    );
}
