'use client';

import { useState, type FormEvent } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useApi } from '@/lib/hooks/useApi';
import { useMutation } from '@/lib/hooks/useMutation';
import * as companyService from '@/lib/api/services/company.service';
import * as inviteService from '@/lib/api/services/invite.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { CompanyInput, CompanyResponse } from '@/types/company.types';
import type { InviteResponse } from '@/types/invite.types';

type Tab = 'join' | 'create';

const ROLE_LABEL: Record<string, string> = {
  company_admin: 'Admin',
  pm: 'PM',
  member: 'Member',
};

export function OnboardingScreen() {
  const [tab, setTab] = useState<Tab>('join');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-6 py-16">
      <div className="mb-8 flex flex-col items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600">
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </div>
        <span className="mt-3 text-2xl font-bold text-white">Sauron</span>
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-6 flex rounded-lg border border-gray-800 bg-gray-900 p-1">
          <TabButton active={tab === 'join'} onClick={() => setTab('join')}>
            Join a Company
          </TabButton>
          <TabButton active={tab === 'create'} onClick={() => setTab('create')}>
            Create Company
          </TabButton>
        </div>

        {tab === 'join' ? <JoinTab /> : <CreateTab />}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        active ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-gray-200'
      }`}
    >
      {children}
    </button>
  );
}

function JoinTab() {
  const { user, refreshCompanies } = useAuth();

  const {
    data: invites,
    isLoading,
    error,
    refetch,
  } = useApi<InviteResponse[]>(() => inviteService.getPendingInvites(), { deps: [] });

  const {
    mutate: accept,
    isLoading: accepting,
    error: acceptError,
  } = useMutation<void, string>((token) => inviteService.acceptInvite(token));

  const handleAccept = async (token: string) => {
    try {
      await accept(token);
      await refreshCompanies();
    } catch {
      // acceptError displayed below
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Join a company</h1>
        <p className="mt-1 text-sm text-gray-400">
          Accept a pending invite or share your email with an admin to get one.
        </p>
      </div>

      {user && (
        <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/60 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-500">Your signup email</p>
            <p className="mt-0.5 truncate font-mono text-sm text-orange-300">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={() => void navigator.clipboard.writeText(user.email)}
            className="shrink-0 rounded border border-gray-700 px-2.5 py-1.5 text-xs font-medium text-gray-400 hover:border-gray-500 hover:text-gray-200 transition-colors"
          >
            Copy
          </button>
        </div>
      )}

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
          Pending invites
        </p>

        {isLoading && (
          <div className="space-y-2">
            {[0, 1].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-gray-800" />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-800/50 bg-red-950/60 px-4 py-3">
            <p className="text-sm text-red-400">{error.message}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-1 text-xs text-red-400 underline hover:text-red-300"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && invites && invites.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-700 bg-gray-900 px-4 py-6 text-center">
            <p className="text-sm text-gray-400">No pending invites yet.</p>
            <p className="mt-1 text-xs text-gray-600">
              Copy your email above and ask your company admin to invite you.
            </p>
          </div>
        )}

        {!isLoading && !error && invites && invites.length > 0 && (
          <ul className="divide-y divide-gray-800 rounded-lg border border-gray-800 bg-gray-900">
            {invites.map((invite) => (
              <li key={invite._id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {invite.companyName ?? invite.companyId}
                  </p>
                  <p className="text-xs text-gray-500">
                    {ROLE_LABEL[invite.role] ?? invite.role}
                    {' · '}
                    expires {new Date(invite.expiresAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="orange"
                  onClick={() => void handleAccept(invite.token)}
                  disabled={accepting}
                >
                  Accept
                </Button>
              </li>
            ))}
          </ul>
        )}

        {acceptError && (
          <div className="mt-3 rounded-lg border border-red-800/50 bg-red-950/60 px-4 py-3">
            <p className="text-sm text-red-400">{acceptError.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CreateTab() {
  const { refreshCompanies } = useAuth();
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');

  const { mutate, isLoading, error } = useMutation<CompanyResponse, CompanyInput>((input) =>
    companyService.createCompany(input),
  );

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await mutate({ name, domain: domain || undefined });
      await refreshCompanies();
    } catch {
      // error displayed below
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Set up your company</h1>
        <p className="mt-1 text-sm text-gray-400">
          Create a company to start inviting teammates and tracking projects.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label htmlFor="companyName" className="mb-1.5 block text-sm font-medium text-gray-300">
            Company name
          </label>
          <Input
            id="companyName"
            type="text"
            required
            placeholder="Acme Corp"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label htmlFor="companyDomain" className="mb-1.5 block text-sm font-medium text-gray-300">
            Domain
            <span className="ml-1.5 text-xs font-normal text-gray-500">Optional</span>
          </label>
          <Input
            id="companyDomain"
            type="text"
            placeholder="example.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        {error && (
          <div className="rounded-lg border border-red-800/50 bg-red-950/60 px-4 py-3">
            <p className="text-sm text-red-400">{error.message}</p>
          </div>
        )}

        <Button
          type="submit"
          variant="orange"
          className="w-full py-2.5 text-base font-semibold transition-all duration-150"
          disabled={isLoading}
        >
          {isLoading ? 'Creating…' : 'Create company'}
        </Button>
      </form>
    </div>
  );
}
