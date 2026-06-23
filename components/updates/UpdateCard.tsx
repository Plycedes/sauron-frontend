'use client';

import { cn } from '@/lib/utils/cn';
import type { UpdateCategory, UpdateConfidence, UpdateResponse } from '@/types/update.types';

export interface UpdateCardProps {
    update: UpdateResponse;
    showUser?: boolean;
}

const CATEGORY_STYLES: Record<UpdateCategory, string> = {
    feature: 'bg-indigo-100 text-indigo-800',
    bug: 'bg-red-100 text-red-800',
    review: 'bg-cyan-100 text-cyan-800',
    meeting: 'bg-pink-100 text-pink-800',
    research: 'bg-amber-100 text-amber-800',
    deployment: 'bg-emerald-100 text-emerald-800',
};

const CONFIDENCE_STYLES: Record<UpdateConfidence, string> = {
    low: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-green-100 text-green-800',
};

export function UpdateCard({ update, showUser }: UpdateCardProps) {
    return (
        <article className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            {showUser && (
                // TODO: backend has no GET /users/:id endpoint to resolve authorId → name.
                // For now we display the raw authorId. Replace with the user's name once available.
                <p className="mb-2 text-xs text-gray-500">
                    Submitted by <span className="font-mono">{update.authorId}</span>
                </p>
            )}

            <header className="flex flex-wrap items-center gap-2">
                <time className="text-sm font-medium text-gray-900">
                    {formatDate(update.createdAt)}
                </time>
                <Badge className={CATEGORY_STYLES[update.category]}>{update.category}</Badge>
                <Badge className={CONFIDENCE_STYLES[update.confidence]}>
                    {update.confidence}
                </Badge>
                <span className="ml-auto rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                    {update.hoursSpent}h
                </span>
            </header>

            <dl className="mt-4 space-y-3 text-sm">
                <div>
                    <dt className="font-medium text-gray-700">Completed</dt>
                    <dd className="mt-1 whitespace-pre-wrap text-gray-900">{update.body}</dd>
                </div>
                <div>
                    <dt className="font-medium text-gray-700">Next steps</dt>
                    <dd className="mt-1 whitespace-pre-wrap text-gray-900">{update.nextSteps}</dd>
                </div>
                {update.blockers && update.blockers.toLowerCase() !== 'none' && (
                    <div>
                        <dt className="font-medium text-gray-700">Blockers</dt>
                        <dd className="mt-1 whitespace-pre-wrap text-gray-900">{update.blockers}</dd>
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