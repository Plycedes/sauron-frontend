'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useApi } from '@/lib/hooks/useApi';
import * as projectService from '@/lib/api/services/project.service';
import * as analyticsService from '@/lib/api/services/analytics.service';
import { StatCard } from '@/components/analytics/StatCard';
import { Button } from '@/components/ui/Button';
import type { ProjectResponse } from '@/types/project.types';
import type { ProjectStatsResponse } from '@/types/analytics.types';

const PRIVILEGED_ROLES = ['pm', 'company_admin'] as const;

export default function DashboardPage() {
  const { user, companies } = useAuth();
  if (!user) return null;

  const isPrivileged = (PRIVILEGED_ROLES as readonly string[]).includes(user.role);
  const companyId = companies[0]?.id ?? null;

  if (!isPrivileged) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold text-white">
          Welcome back, {user.fullName ?? user.name}
        </h1>
        <div className="rounded-lg border border-orange-800/30 bg-orange-950/40 p-6">
          <h2 className="text-lg font-semibold text-orange-300">Submit today&apos;s update</h2>
          <p className="mt-1 text-sm text-orange-200/70">
            Keep your team in sync with a quick status update.
          </p>
          <Link
            href="/dashboard/updates/new"
            className="mt-4 inline-block rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500 transition-colors"
          >
            Submit update
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-white">
        Welcome back, {user.fullName ?? user.name}
      </h1>
      <PrivilegedSummary companyId={companyId} />
    </div>
  );
}

function PrivilegedSummary({ companyId }: { companyId: string | null }) {
  const {
    data: projects,
    isLoading,
    error,
    refetch,
  } = useApi<ProjectResponse[]>(() => projectService.getProjects(companyId ?? ''), {
    enabled: companyId !== null,
    deps: [companyId],
  });

  const latestProject = useMemo(() => {
    if (!projects || projects.length === 0) return null;
    return [...projects].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  }, [projects]);

  const activeCount = useMemo(
    () => (projects ? projects.filter((p) => p.status === 'active').length : 0),
    [projects],
  );

  const teamSize = useMemo(() => {
    if (!projects) return 0;
    const ids = new Set<string>();
    for (const p of projects) {
      for (const m of p.members) {
        ids.add(m.userId);
      }
    }
    return ids.size;
  }, [projects]);

  const { data: latestStats, isLoading: latestStatsLoading } = useApi<ProjectStatsResponse>(
    () => analyticsService.getProjectStats(latestProject?.id ?? ''),
    { enabled: latestProject !== null, deps: [latestProject?.id] },
  );

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading summary...</p>;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-800/50 bg-red-950/60 p-4">
        <p className="text-sm text-red-400">{error.message}</p>
        <Button variant="secondary" size="sm" className="mt-2" onClick={() => void refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Active projects" value={activeCount} />
        <StatCard label="Team members" value={teamSize} />
        <StatCard
          label="Latest activity"
          value={
            latestStatsLoading
              ? '...'
              : latestStats?.lastActivityAt
                ? formatRelative(latestStats.lastActivityAt)
                : '—'
          }
        />
      </div>

      {latestProject && (
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                This week&apos;s activity
              </p>
              <h2 className="mt-1 text-lg font-semibold text-white">{latestProject.name}</h2>
            </div>
            <Link
              href={`/dashboard/projects/${latestProject.id}`}
              className="text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors"
            >
              View →
            </Link>
          </div>
          {latestStatsLoading && <p className="mt-3 text-sm text-gray-500">Loading...</p>}
          {latestStats && (
            <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Total updates</p>
                <p className="mt-1 text-xl font-semibold text-white">{latestStats.totalUpdates}</p>
              </div>
              <div>
                <p className="text-gray-500">Avg confidence</p>
                <p className="mt-1 text-xl font-semibold text-white">
                  {Number(latestStats.averageConfidence).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Open blockers</p>
                <p className="mt-1 text-xl font-semibold text-white">{latestStats.blockerCount}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {!latestProject && (
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-8 text-center">
          <h2 className="text-lg font-semibold text-white">No projects yet</h2>
          <p className="mt-1 text-sm text-gray-400">Create a project to start tracking updates.</p>
          <Link
            href="/dashboard/projects"
            className="mt-4 inline-block rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500 transition-colors"
          >
            Go to projects
          </Link>
        </div>
      )}
    </div>
  );
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return iso;
  const diffMs = Date.now() - then;
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}
