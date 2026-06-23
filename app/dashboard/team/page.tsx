'use client';

// TODO: this page is a per-user lookup because the backend has no
// `GET /companies/:id/users` endpoint. Once that endpoint exists, replace the
// userId text input with a searchable member directory. This same gap
// affects three places in the frontend:
//   1. components/projects/AddMemberModal.tsx
//   2. app/dashboard/ask/page.tsx (user filter)
//   3. this file
// See BACKEND_TODO.md ("GET /companies/:id/users") for the full list of
// fields the new endpoint should expose.

import { useState, type FormEvent } from 'react';
import { ProtectedRoute } from '@/lib/auth/ProtectedRoute';
import { useApi } from '@/lib/hooks/useApi';
import * as analyticsService from '@/lib/api/services/analytics.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatCard } from '@/components/analytics/StatCard';
import type { UserStatsResponse } from '@/types/analytics.types';

export default function TeamPage() {
    return (
        <ProtectedRoute allowedRoles={['pm', 'company_admin']}>
            <TeamContent />
        </ProtectedRoute>
    );
}

function TeamContent() {
    const [userIdInput, setUserIdInput] = useState('');
    const [searchedUserId, setSearchedUserId] = useState<string | null>(null);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmed = userIdInput.trim();
        if (trimmed.length === 0) return;
        setSearchedUserId(trimmed);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-semibold text-gray-900">Team</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Look up an individual teammate&apos;s update history and stats.
                </p>
            </div>

            <form
                onSubmit={onSubmit}
                className="flex flex-wrap items-end gap-3 rounded-md border border-gray-200 bg-white p-4"
            >
                <div className="flex-1 min-w-[200px]">
                    <label
                        htmlFor="userId"
                        className="mb-1 block text-xs font-medium text-gray-600"
                    >
                        User ID
                    </label>
                    <Input
                        id="userId"
                        type="text"
                        value={userIdInput}
                        onChange={(e) => setUserIdInput(e.target.value)}
                        placeholder="e.g. jdoe"
                    />
                </div>
                <Button type="submit" disabled={userIdInput.trim().length === 0}>
                    Look up
                </Button>
            </form>

            {/* TODO: see top-of-file note — replace with a member directory once
                the backend exposes GET /companies/:id/users. */}
            <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                <strong>Backend gap:</strong> no company-wide user directory yet. Enter a
                userId to look up an individual teammate.
            </p>

            {searchedUserId && <UserStatsView userId={searchedUserId} />}
        </div>
    );
}

function UserStatsView({ userId }: { userId: string }) {
    const { data, isLoading, error, refetch } = useApi<UserStatsResponse>(
        () => analyticsService.getUserStats(userId),
        { deps: [userId] },
    );

    if (isLoading) return <p className="text-sm text-gray-500">Loading stats...</p>;

    if (error) {
        return (
            <div className="rounded-md border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-800">{error.message}</p>
                <Button
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                    onClick={() => void refetch()}
                >
                    Retry
                </Button>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Current streak"
                    value="—"
                    highlighted
                    icon={<span aria-hidden>🔥</span>}
                />
                <StatCard
                    label="Total updates"
                    value={data.totalUpdates}
                />
                <StatCard
                    label="Projects contributed"
                    value={data.projectsContributed}
                />
                <StatCard
                    label="Avg confidence"
                    value={Number(data.averageConfidence).toFixed(2)}
                />
            </div>

            <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                <strong>Backend gap:</strong> UserStats response doesn&apos;t include a streak
                field yet. Showing &quot;—&quot; for now. See BACKEND_TODO.md.
            </p>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">Last update</h2>
                <p className="mt-1 text-sm text-gray-700">
                    {data.lastUpdateAt ? formatDate(data.lastUpdateAt) : 'No updates yet.'}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-md border border-dashed border-amber-300 bg-amber-50 p-4">
                    <p className="text-sm font-medium text-amber-900">Per-project breakdown</p>
                    <p className="mt-1 text-xs text-amber-800">
                        UserStats doesn&apos;t return per-project hours / update counts / avg
                        confidence yet. Backend needs to extend the response.
                    </p>
                </div>
                <div className="rounded-md border border-dashed border-amber-300 bg-amber-50 p-4">
                    <p className="text-sm font-medium text-amber-900">Category breakdown</p>
                    <p className="mt-1 text-xs text-amber-800">
                        UserStats doesn&apos;t return per-category counts yet. Backend needs to
                        extend the response.
                    </p>
                </div>
            </div>
        </div>
    );
}

function formatDate(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
