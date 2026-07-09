'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { useApi } from '@/lib/hooks/useApi';
import * as projectService from '@/lib/api/services/project.service';
import * as updateService from '@/lib/api/services/update.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UpdateCard } from '@/components/updates/UpdateCard';
import type { ProjectResponse } from '@/types/project.types';
import type { UpdateResponse } from '@/types/update.types';

const darkSelect =
  'w-48 rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500';

export default function MyUpdatesPage() {
  const { user, activeCompany } = useAuth();
  const companyId = activeCompany?._id ?? null;
  const userId = user?.id ?? null;

  const [projectId, setProjectId] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const { data: projects } = useApi<ProjectResponse[]>(
    () => projectService.getProjects(companyId ?? ''),
    { enabled: companyId !== null, deps: [companyId] },
  );

  const myProjects = useMemo(() => {
    if (!projects || !user) return [];
    return projects.filter((p) => p.members.some((m) => m._id === (user?.id ?? '')));
  }, [projects, user]);

  const { data, isLoading, error, refetch } = useApi<UpdateResponse[]>(
    () =>
      updateService.getUpdatesByUser(
        userId ?? '',
        projectId || undefined,
        from || undefined,
        to || undefined,
      ),
    { enabled: userId !== null, deps: [userId, projectId, from, to] },
  );

  const sorted = data ? [...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt)) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-white">My updates</h1>
        <Link
          href="/dashboard/updates/new"
          className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500 transition-colors"
        >
          + Submit Update
        </Link>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-800 bg-gray-900 p-4">
        <div>
          <label htmlFor="filterProject" className="mb-1 block text-xs font-medium text-gray-400">
            Project
          </label>
          <select
            id="filterProject"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className={darkSelect}
          >
            <option value="">All projects</option>
            {myProjects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="from" className="mb-1 block text-xs font-medium text-gray-400">
            From
          </label>
          <Input
            id="from"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-40 bg-gray-800 border-gray-700 text-white focus:ring-orange-500"
          />
        </div>
        <div>
          <label htmlFor="to" className="mb-1 block text-xs font-medium text-gray-400">
            To
          </label>
          <Input
            id="to"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-40 bg-gray-800 border-gray-700 text-white focus:ring-orange-500"
          />
        </div>
        {(projectId || from || to) && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setProjectId('');
              setFrom('');
              setTo('');
            }}
          >
            Clear
          </Button>
        )}
      </div>

      {isLoading && <p className="text-sm text-gray-500">Loading updates...</p>}

      {error && (
        <div className="rounded-lg border border-red-800/50 bg-red-950/60 p-4">
          <p className="text-sm text-red-400">{error.message}</p>
          <Button variant="secondary" size="sm" className="mt-2" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !error && sorted.length === 0 && (
        <div className="rounded-lg border border-gray-800 bg-gray-900 p-8 text-center">
          <h2 className="text-lg font-semibold text-white">No updates yet</h2>
          <p className="mt-1 text-sm text-gray-400">
            Submit your first update to start tracking your work.
          </p>
          <Link
            href="/dashboard/updates/new"
            className="mt-4 inline-block rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500 transition-colors"
          >
            Submit update
          </Link>
        </div>
      )}

      {!isLoading && !error && sorted.length > 0 && (
        <div className="space-y-3">
          {sorted.map((u) => (
            <UpdateCard key={u._id} update={u} />
          ))}
        </div>
      )}
    </div>
  );
}
