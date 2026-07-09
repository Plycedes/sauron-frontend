'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/lib/auth/ProtectedRoute';
import { useAuth } from '@/lib/auth/AuthContext';
import { useApi } from '@/lib/hooks/useApi';
import * as companyService from '@/lib/api/services/company.service';
import * as analyticsService from '@/lib/api/services/analytics.service';
import * as updateService from '@/lib/api/services/update.service';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/analytics/StatCard';
import { UpdateCard } from '@/components/updates/UpdateCard';
import { SendInviteModal } from '@/components/onboarding/SendInviteModal';
import type { MembershipResponse } from '@/types/company.types';
import type { UserStatsResponse } from '@/types/analytics.types';
import type { UpdateResponse } from '@/types/update.types';

export default function TeamPage() {
  return (
    <ProtectedRoute allowedRoles={['pm', 'company_admin']}>
      <TeamContent />
    </ProtectedRoute>
  );
}

function TeamContent() {
  const { user, activeCompany } = useAuth();
  const companyId = activeCompany?.id ?? null;
  const isAdmin = user?.role === 'company_admin';

  const [selectedMember, setSelectedMember] = useState<MembershipResponse | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  const {
    data: members,
    isLoading,
    error,
    refetch,
  } = useApi<MembershipResponse[]>(() => companyService.getCompanyMembers(companyId ?? ''), {
    enabled: companyId !== null,
    deps: [companyId],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Team</h1>
          <p className="mt-1 text-sm text-gray-600">View team members and their update history.</p>
        </div>
        {isAdmin && <Button onClick={() => setInviteOpen(true)}>+ Invite member</Button>}
      </div>

      {isLoading && <MembersSkeleton />}

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{error.message}</p>
          <Button variant="secondary" size="sm" className="mt-2" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !error && members && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <MemberList
              members={members}
              selectedId={selectedMember?.userId ?? null}
              onSelect={setSelectedMember}
            />
          </div>

          <div className="lg:col-span-2">
            {selectedMember ? (
              <MemberDetail member={selectedMember} />
            ) : (
              <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white">
                <p className="text-sm text-gray-500">Select a team member to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {companyId && (
        <SendInviteModal
          isOpen={inviteOpen}
          onClose={() => setInviteOpen(false)}
          companyId={companyId}
          onSent={() => void refetch()}
        />
      )}
    </div>
  );
}

function MemberList({
  members,
  selectedId,
  onSelect,
}: {
  members: MembershipResponse[];
  selectedId: string | null;
  onSelect: (m: MembershipResponse) => void;
}) {
  const ROLE_LABEL: Record<string, string> = {
    company_admin: 'Admin',
    pm: 'PM',
    member: 'Member',
  };

  if (members.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
        <p className="text-sm text-gray-500">No members yet. Invite your team to get started.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
      {members.map((m) => {
        const isSelected = m.userId === selectedId;
        return (
          <li key={m.id}>
            <button
              type="button"
              onClick={() => onSelect(m)}
              className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors ${
                isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <div>
                <p
                  className={`text-sm font-medium ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}
                >
                  {m.userId}
                </p>
                <p className="text-xs text-gray-500">
                  Joined {new Date(m.joinedAt).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`rounded px-2 py-0.5 text-xs font-medium uppercase ${
                  m.role === 'company_admin'
                    ? 'bg-orange-100 text-orange-800'
                    : m.role === 'pm'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-700'
                }`}
              >
                {ROLE_LABEL[m.role]}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function MemberDetail({ member }: { member: MembershipResponse }) {
  const [showUpdates, setShowUpdates] = useState(false);

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useApi<UserStatsResponse>(() => analyticsService.getUserStats(member.userId), {
    deps: [member.userId],
  });

  const { data: updates, isLoading: updatesLoading } = useApi<UpdateResponse[]>(
    () => updateService.getUpdatesByUser(member.userId),
    { enabled: showUpdates, deps: [member.userId, showUpdates] },
  );

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{member.userId}</h2>
          <Button variant="secondary" size="sm" onClick={() => setShowUpdates((v) => !v)}>
            {showUpdates ? 'Hide updates' : 'View updates'}
          </Button>
        </div>

        {statsLoading && <p className="mt-3 text-sm text-gray-500">Loading stats...</p>}

        {statsError && <p className="mt-3 text-sm text-red-600">{statsError.message}</p>}

        {stats && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Total updates" value={stats.totalUpdates} />
            <StatCard label="Projects" value={stats.projectsContributed} />
            <StatCard label="Avg confidence" value={Number(stats.averageConfidence).toFixed(2)} />
            <StatCard
              label="Last update"
              value={stats.lastUpdateAt ? formatRelative(stats.lastUpdateAt) : '—'}
            />
          </div>
        )}
      </div>

      {showUpdates && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Recent updates</h3>

          {updatesLoading && <p className="text-sm text-gray-500">Loading updates...</p>}

          {!updatesLoading && updates && updates.length === 0 && (
            <p className="rounded-lg border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
              No updates yet.
            </p>
          )}

          {!updatesLoading && updates && updates.length > 0 && (
            <div className="space-y-3">
              {[...updates]
                .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                .map((u) => (
                  <UpdateCard key={u.id} update={u} showUser />
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MembersSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="animate-pulse space-y-2 lg:col-span-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-14 rounded-lg bg-gray-200" />
        ))}
      </div>
      <div className="h-48 animate-pulse rounded-lg bg-gray-200 lg:col-span-2" />
    </div>
  );
}

function formatRelative(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / 86_400_000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}
