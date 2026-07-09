'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { useApi } from '@/lib/hooks/useApi';
import { useMutation } from '@/lib/hooks/useMutation';
import * as projectService from '@/lib/api/services/project.service';
import * as updateService from '@/lib/api/services/update.service';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { ConfidenceToggle } from '@/components/updates/ConfidenceToggle';
import type { ProjectResponse } from '@/types/project.types';
import type { UpdateCategory, UpdateConfidence, UpdateInput, UpdateResponse } from '@/types/update.types';

const CATEGORIES: UpdateCategory[] = [
    'feature',
    'bug',
    'review',
    'meeting',
    'research',
    'deployment',
];

const COMPLETED_MIN = 30;
const NEXT_STEPS_MIN = 20;
const HOURS_MIN = 0.5;
const HOURS_MAX = 12;
const REDIRECT_DELAY_MS = 1500;

export default function NewUpdatePage() {
    const router = useRouter();
    const { user, companies } = useAuth();
    const companyId = companies[0]?.id ?? null;

    const [projectId, setProjectId] = useState('');
    const [completed, setCompleted] = useState('');
    const [nextSteps, setNextSteps] = useState('');
    const [blockers, setBlockers] = useState('');
    const [category, setCategory] = useState<UpdateCategory | ''>('');
    const [hoursSpent, setHoursSpent] = useState<number>(1);
    const [confidence, setConfidence] = useState<UpdateConfidence | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const { data: projects } = useApi<ProjectResponse[]>(
        () => projectService.getProjects(companyId ?? ''),
        { enabled: companyId !== null, deps: [companyId] },
    );

    // Defense in depth: backend filters for member role but we filter for all roles.
    const myProjects = useMemo(() => {
        if (!projects || !user) return [];
        return projects.filter((p) => p.members.some((m) => m.userId === user.id));
    }, [projects, user]);

    const isValid =
        projectId !== '' &&
        completed.trim().length >= COMPLETED_MIN &&
        nextSteps.trim().length >= NEXT_STEPS_MIN &&
        hoursSpent >= HOURS_MIN &&
        hoursSpent <= HOURS_MAX &&
        confidence !== null &&
        category !== '';

    const { mutate, isLoading, error } = useMutation<UpdateResponse, UpdateInput>(
        (input) => updateService.submitUpdate(input),
    );

    const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        return () => {
            if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
        };
    }, []);

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isValid || !confidence || !category) return;
        try {
            await mutate({
                projectId,
                category,
                confidence,
                body: completed.trim(),
                hoursSpent,
                nextSteps: nextSteps.trim(),
                blockers: blockers.trim() || 'None',
            });
            setShowSuccess(true);
            redirectTimerRef.current = setTimeout(() => {
                router.push('/dashboard');
            }, REDIRECT_DELAY_MS);
        } catch {
            // Error displayed via mutation.error; 409 handling below.
        }
    };

    const alreadySubmittedToday = error?.statusCode === 409;

    return (
        <div className="mx-auto mt-10 max-w-2xl">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-semibold text-gray-900">Submit daily update</h1>
                <Link href="/dashboard/updates" className="text-sm text-gray-500 hover:text-gray-700">
                    ← Back to my updates
                </Link>
            </div>

            {showSuccess && (
                <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                    Update submitted! Redirecting...
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-5 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div>
                    <label htmlFor="project" className="mb-1 block text-sm font-medium text-gray-700">
                        Project
                    </label>
                    <select
                        id="project"
                        required
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="" disabled>
                            Select a project
                        </option>
                        {myProjects.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                    {myProjects.length === 0 && (
                        <p className="mt-1 text-xs text-gray-500">
                            You aren&apos;t assigned to any projects yet.
                        </p>
                    )}
                </div>

                <div>
                    <div className="mb-1 flex items-baseline justify-between">
                        <label htmlFor="completed" className="block text-sm font-medium text-gray-700">
                            Completed today
                        </label>
                        <CharCount value={completed} min={COMPLETED_MIN} />
                    </div>
                    <Textarea
                        id="completed"
                        rows={4}
                        value={completed}
                        onChange={(e) => setCompleted(e.target.value)}
                    />
                </div>

                <div>
                    <div className="mb-1 flex items-baseline justify-between">
                        <label htmlFor="nextSteps" className="block text-sm font-medium text-gray-700">
                            Next steps
                        </label>
                        <CharCount value={nextSteps} min={NEXT_STEPS_MIN} />
                    </div>
                    <Textarea
                        id="nextSteps"
                        rows={3}
                        value={nextSteps}
                        onChange={(e) => setNextSteps(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="blockers" className="mb-1 block text-sm font-medium text-gray-700">
                        Blockers
                    </label>
                    <Textarea
                        id="blockers"
                        rows={2}
                        value={blockers}
                        onChange={(e) => setBlockers(e.target.value)}
                        placeholder="None"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="category" className="mb-1 block text-sm font-medium text-gray-700">
                            Category
                        </label>
                        <select
                            id="category"
                            required
                            value={category}
                            onChange={(e) => setCategory(e.target.value as UpdateCategory)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" disabled>
                                Select a category
                            </option>
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="hoursSpent" className="mb-1 block text-sm font-medium text-gray-700">
                            Hours spent
                        </label>
                        <Input
                            id="hoursSpent"
                            type="number"
                            min={HOURS_MIN}
                            max={HOURS_MAX}
                            step={0.5}
                            value={hoursSpent}
                            onChange={(e) => setHoursSpent(parseFloat(e.target.value) || 0)}
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Confidence
                    </label>
                    <ConfidenceToggle value={confidence} onChange={setConfidence} />
                </div>

                {alreadySubmittedToday && (
                    <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                        You&apos;ve already submitted an update for this project today.
                    </p>
                )}
                {error && !alreadySubmittedToday && (
                    <p className="text-sm text-red-600">{error.message}</p>
                )}

                <div className="flex justify-end gap-2 pt-2">
                    <Button
                        variant="secondary"
                        type="button"
                        onClick={() => router.back()}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={!isValid || isLoading}>
                        {isLoading ? 'Submitting...' : 'Submit update'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

function CharCount({ value, min }: { value: string; min: number }) {
    const len = value.trim().length;
    const ok = len >= min;
    return (
        <span
            className={
                len === 0
                    ? 'text-xs text-gray-400'
                    : ok
                      ? 'text-xs text-green-600'
                      : 'text-xs text-red-600'
            }
        >
            {len}/{min}{ok ? ' ✓' : ''}
        </span>
    );
}