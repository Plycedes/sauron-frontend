'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  highlighted?: boolean;
}

const TREND_STYLES: Record<
  NonNullable<StatCardProps['trend']>,
  { arrow: string; color: string }
> = {
  up: { arrow: '↑', color: 'text-green-400' },
  down: { arrow: '↓', color: 'text-red-400' },
  neutral: { arrow: '→', color: 'text-gray-500' },
};

export function StatCard({ label, value, icon, trend, highlighted }: StatCardProps) {
  const trendStyle = trend ? TREND_STYLES[trend] : null;

  return (
    <div
      className={cn(
        'rounded-lg border bg-gray-900 p-6 shadow-sm',
        highlighted ? 'border-orange-700/50 ring-2 ring-orange-900/40' : 'border-gray-800',
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-gray-400">{label}</p>
        {icon && (
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-gray-400"
            aria-hidden
          >
            {icon}
          </span>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <p className={cn('font-semibold text-white', highlighted ? 'text-4xl' : 'text-3xl')}>
          {value}
        </p>
        {trendStyle && (
          <span className={cn('text-sm font-medium', trendStyle.color)}>{trendStyle.arrow}</span>
        )}
      </div>
    </div>
  );
}
