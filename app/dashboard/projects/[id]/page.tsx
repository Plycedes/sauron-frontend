'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { useApi } from '@/lib/hooks/useApi';
import { useMutation } from '@/lib/hooks/useMutation';
import * as projectService from '@/lib/api/services/project.service';
import * as updateService from '@/lib/api/services/update.service';
import * as analyticsService from '@/lib/api/services/analytics.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/projects/StatusBadge';
import { AddMemberModal } from '@/components/projects/AddMemberModal';
import { UpdateCard } from '@/components/updates/UpdateCard';
import { StatCard } from '@/components/analytics/StatCard';
import { ConfidenceTrendChart } from '@/components/analytics/ConfidenceTrendChart';
import type { ProjectResponse } from '@/types/project.types';
import type { UpdateResponse } from '@/types/update.types';
import type {
  ConfidenceTrendPoint,
  ProjectStatsResponse,
  StaleMemberResponse,
} from '@/types/analytics.types';

const PRIVILEGED_ROLES = ['pm', 'company_admin'] as const;
type Tab = 'members' | 'updates' | 'analytics';

const darkSelect =
  'w-40 rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500';

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { activeCompany } = useAuth();
  const companyId = activeCompany?.id ?? null;
  const isPrivileged =
    !!activeCompany && (PRIVILEGED_ROLES as readonly string[]).includes(activeCompany.role);

  const [activeTab, setActiveTab] = useState<Tab>('members');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // TODO: backend has no GET /projects/:id route yet. Refactor to call a
  // dedicated endpoint once it lands. Until then we fetch the full company
  // project list and find by id client-side.
  const {
    data: projects,
    isLoading,
    error,
    refetch,
  } = useApi<ProjectResponse[]>(() => projectService.getProjects(companyId ?? ''), {
    enabled: companyId !== null && !!id,
    deps: [companyId, id],
  });

  const removeMutation = useMutation<void, string>((memberId) =>
    projectService.removeProjectMember(id ?? '', memberId),
  );

  if (!id) return null;

  const project = projects?.find((p) => p.id === id) ?? null;

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading project...</p>;
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

  if (!project) {
    return (
      <div className="rounded-lg border border-gray-800 bg-gray-900 p-8 text-center">
        <h2 className="text-lg font-semibold text-white">Project not found</h2>
        <p className="mt-1 text-sm text-gray-400">
          The project you&apos;re looking for doesn&apos;t exist or you don&apos;t have access.
        </p>
        <Link
          href="/dashboard/projects"
          className="mt-4 inline-block text-sm text-orange-400 hover:text-orange-300 transition-colors"
        >
          ← Back to projects
        </Link>
      </div>
    );
  }

  const handleRemove = async (memberId: string) => {
    if (!window.confirm('Remove this member from the project?')) return;
    try {
      await removeMutation.mutate(memberId);
      await refetch();
    } catch {
      // Error available via removeMutation.error; could surface in a toast.
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/dashboard/projects"
            className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
          >
            ← Projects
          </Link>
          <div className="mt-1 flex items-center gap-3">
            <h1 className="text-3xl font-semibold text-white">{project.name}</h1>
            <StatusBadge status={project.status} />
          </div>
          {project.description && (
            <p className="mt-2 text-sm text-gray-400">{project.description}</p>
          )}
        </div>
      </div>

      <div className="border-b border-gray-800">
        <nav className="-mb-px flex gap-6">
          {(['members', 'updates', 'analytics'] as Tab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={
                activeTab === tab
                  ? 'border-b-2 border-orange-500 px-1 pb-2 text-sm font-medium text-orange-400 capitalize'
                  : 'border-b-2 border-transparent px-1 pb-2 text-sm font-medium text-gray-500 hover:text-gray-300 capitalize transition-colors'
              }
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'members' && (
        <MembersTab
          project={project}
          isPrivileged={isPrivileged}
          onAddClick={() => setIsAddOpen(true)}
          onRemove={handleRemove}
          removeError={removeMutation.error}
          isRemoving={removeMutation.isLoading}
        />
      )}

      {activeTab === 'updates' && <UpdatesTab projectId={id} />}

      {activeTab === 'analytics' && <AnalyticsTab projectId={id} />}

      <AddMemberModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        projectId={id}
        onAdded={() => void refetch()}
      />
    </div>
  );
}

function MembersTab({
  project,
  isPrivileged,
  onAddClick,
  onRemove,
  removeError,
  isRemoving,
}: {
  project: ProjectResponse;
  isPrivileged: boolean;
  onAddClick: () => void;
  onRemove: (memberId: string) => Promise<void>;
  removeError: { message: string } | null;
  isRemoving: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Members</h2>
        {isPrivileged && (
          <Button size="sm" variant="orange" onClick={onAddClick}>
            + Add Member
          </Button>
        )}
      </div>

      {removeError && (
        <div className="rounded-lg border border-red-800/50 bg-red-950/60 px-4 py-3">
          <p className="text-sm text-red-400">{removeError.message}</p>
        </div>
      )}

      {project.members.length === 0 ? (
        <p className="rounded-lg border border-gray-800 bg-gray-900 p-6 text-center text-sm text-gray-400">
          No members yet.
        </p>
      ) : (
        <ul className="divide-y divide-gray-800 rounded-lg border border-gray-800 bg-gray-900">
          {project.members.map((member) => (
            <li key={member.userId} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-white">{member.userId}</span>
                <span
                  className={
                    member.role === 'pm'
                      ? 'rounded bg-purple-900/50 px-2 py-0.5 text-xs font-medium uppercase text-purple-400'
                      : 'rounded bg-gray-800 px-2 py-0.5 text-xs font-medium uppercase text-gray-400'
                  }
                >
                  {member.role}
                </span>
              </div>
              {isPrivileged && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => void onRemove(member.userId)}
                  disabled={isRemoving}
                >
                  Remove
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PlaceholderCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-8 text-center">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-1 text-sm text-gray-400">{body}</p>
    </div>
  );
}

function GapCard({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-lg border border-amber-800/50 bg-amber-950/40 p-4">
      <p className="text-sm font-medium text-amber-400">{title}</p>
      <p className="mt-1 text-xs text-amber-500">{message}</p>
    </div>
  );
}

function AnalyticsTab({ projectId }: { projectId: string }) {
  const statsQ = useApi<ProjectStatsResponse>(() => analyticsService.getProjectStats(projectId), {
    deps: [projectId],
  });
  const trendQ = useApi<ConfidenceTrendPoint[]>(
    () => analyticsService.getConfidenceTrend(projectId, 30),
    { deps: [projectId] },
  );
  const staleQ = useApi<StaleMemberResponse[]>(
    () => analyticsService.getStaleMembers(projectId, 3),
    { deps: [projectId] },
  );

  const isLoading = statsQ.isLoading;
  const error = statsQ.error;

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading analytics...</p>;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-800/50 bg-red-950/60 p-4">
        <p className="text-sm text-red-400">{error.message}</p>
        <Button
          variant="secondary"
          size="sm"
          className="mt-2"
          onClick={() => void statsQ.refetch()}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!statsQ.data) return null;

  const stats = statsQ.data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total updates" value={stats.totalUpdates} />
        <StatCard label="Contributors" value={stats.uniqueContributors} />
        <StatCard label="Avg confidence" value={Number(stats.averageConfidence).toFixed(2)} />
        <StatCard label="Open blockers" value={stats.blockerCount} />
      </div>

      <div className="rounded-lg border border-gray-800 bg-gray-900 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-white">Confidence trend (30 days)</h2>
        {trendQ.isLoading && <p className="mt-3 text-sm text-gray-500">Loading trend...</p>}
        {trendQ.error && <p className="mt-3 text-sm text-red-400">{trendQ.error.message}</p>}
        {trendQ.data && <ConfidenceTrendChart data={trendQ.data} />}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <GapCard
          title="Category breakdown"
          message="ProjectStats doesn't return per-category counts yet. Backend needs to extend the response."
        />
        <GapCard
          title="Per-member breakdown"
          message="ProjectStats doesn't return per-member hours / update counts / confidence split yet. Backend needs to extend the response."
        />
      </div>

      {staleQ.data && staleQ.data.length > 0 && (
        <div className="rounded-lg border border-yellow-800/50 bg-yellow-950/40 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-yellow-400">
            Stale members ({staleQ.data.length})
          </h2>
          <p className="mt-1 text-sm text-yellow-500">Members with no updates in 3+ days.</p>
          <ul className="mt-3 space-y-2">
            {staleQ.data.map((m) => (
              <li
                key={m.userId}
                className="flex items-center justify-between rounded border border-yellow-800/40 bg-gray-900 px-3 py-2 text-sm"
              >
                <span className="font-medium text-white">{m.name?.trim() || m.userId}</span>
                <span className="text-xs text-yellow-500">
                  {m.daysSinceLastUpdate == null
                    ? 'no update yet'
                    : `no update in ${m.daysSinceLastUpdate} day${
                        m.daysSinceLastUpdate === 1 ? '' : 's'
                      }`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function UpdatesTab({ projectId }: { projectId: string }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const { data, isLoading, error, refetch } = useApi<UpdateResponse[]>(
    () => updateService.getUpdatesByProject(projectId, from || undefined, to || undefined),
    { deps: [projectId, from, to] },
  );

  const sorted = data ? [...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt)) : [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-800 bg-gray-900 p-4">
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
        {(from || to) && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
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
          <p className="text-sm text-gray-400">No updates yet for this project.</p>
        </div>
      )}

      {!isLoading && !error && sorted.length > 0 && (
        <div className="space-y-3">
          {sorted.map((u) => (
            <UpdateCard key={u.id} update={u} showUser />
          ))}
        </div>
      )}
    </div>
  );
}
