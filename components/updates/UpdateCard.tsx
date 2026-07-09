'use client';

import { cn } from '@/lib/utils/cn';
import type { UpdateCategory, UpdateConfidence, UpdateResponse } from '@/types/update.types';

export interface UpdateCardProps {
  update: UpdateResponse;
  showUser?: boolean;
}

const CATEGORY_STYLES: Record<UpdateCategory, string> = {
  feature: 'bg-indigo-900/50 text-indigo-300',
  bug: 'bg-red-900/50 text-red-300',
  review: 'bg-cyan-900/50 text-cyan-300',
  meeting: 'bg-pink-900/50 text-pink-300',
  research: 'bg-amber-900/50 text-amber-300',
  deployment: 'bg-emerald-900/50 text-emerald-300',
};

const CONFIDENCE_STYLES: Record<UpdateConfidence, string> = {
  low: 'bg-red-900/50 text-red-300',
  medium: 'bg-yellow-900/50 text-yellow-300',
  high: 'bg-green-900/50 text-green-300',
};

export function UpdateCard({ update, showUser }: UpdateCardProps) {
  return (
    <article className="rounded-lg border border-gray-800 bg-gray-900 p-5 shadow-sm">
      {showUser && (
        <p className="mb-2 text-xs text-gray-500">
          Submitted by <span className="font-mono text-gray-400">{update.userId}</span>
        </p>
      )}

      <header className="flex flex-wrap items-center gap-2">
        <time className="text-sm font-medium text-white">{formatDate(update.createdAt)}</time>
        <Badge className={CATEGORY_STYLES[update.category]}>{update.category}</Badge>
        <Badge className={CONFIDENCE_STYLES[update.confidence]}>{update.confidence}</Badge>
        <span className="ml-auto rounded bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-400">
          {update.hoursSpent}h
        </span>
      </header>

      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="font-medium text-gray-300">Completed</dt>
          <dd className="mt-1 whitespace-pre-wrap text-gray-100">{update.completed}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-300">Next steps</dt>
          <dd className="mt-1 whitespace-pre-wrap text-gray-100">{update.nextSteps}</dd>
        </div>
        {update.blockers && update.blockers.toLowerCase() !== 'none' && (
          <div>
            <dt className="font-medium text-gray-300">Blockers</dt>
            <dd className="mt-1 whitespace-pre-wrap text-gray-100">{update.blockers}</dd>
          </div>
        )}
      </dl>
    </article>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize',
        className,
      )}
    >
      {children}
    </span>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
