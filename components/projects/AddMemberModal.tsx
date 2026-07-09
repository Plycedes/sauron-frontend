'use client';

import { useState, type FormEvent } from 'react';
import { useMutation } from '@/lib/hooks/useMutation';
import { useApi } from '@/lib/hooks/useApi';
import { useAuth } from '@/lib/auth/AuthContext';
import * as projectService from '@/lib/api/services/project.service';
import * as companyService from '@/lib/api/services/company.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { MembershipResponse } from '@/types/company.types';

export interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onAdded: () => void;
}

export function AddMemberModal({ isOpen, onClose, projectId, onAdded }: AddMemberModalProps) {
  const { activeCompany } = useAuth();
  const companyId = activeCompany?._id ?? null;

  const [userId, setUserId] = useState('');

  const { data: members } = useApi<MembershipResponse[]>(
    () => companyService.getCompanyMembers(companyId ?? ''),
    { enabled: isOpen && companyId !== null, deps: [companyId, isOpen] },
  );

  const { mutate, isLoading, error, reset } = useMutation<void, string>((id) =>
    projectService.addProjectMember(projectId, id),
  );

  if (!isOpen) return null;

  const handleClose = () => {
    reset();
    setUserId('');
    onClose();
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId.trim()) return;
    try {
      await mutate(userId.trim());
      onAdded();
      handleClose();
    } catch {
      // Error displayed via mutation.error
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-white">Add member</h2>
        <p className="mt-1 text-sm text-gray-400">
          Select a company member to add to this project.
        </p>

        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          {members && members.length > 0 ? (
            <div>
              <label
                htmlFor="memberSelect"
                className="mb-1.5 block text-sm font-medium text-gray-300"
              >
                Team member
              </label>
              <select
                id="memberSelect"
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select a member...</option>
                {members.map((m) => (
                  <option key={m._id} value={m.userId}>
                    {m.userId} — {m.role}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label
                htmlFor="memberUserId"
                className="mb-1.5 block text-sm font-medium text-gray-300"
              >
                User ID
              </label>
              <Input
                id="memberUserId"
                type="text"
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g. jdoe"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-950/60 border border-red-800/50 px-4 py-3">
              <p className="text-sm text-red-400">{error.message}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="orange" disabled={isLoading}>
              {isLoading ? 'Adding…' : 'Add member'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
