'use client';

import { useState, type FormEvent } from 'react';
import { useMutation } from '@/lib/hooks/useMutation';
import * as inviteService from '@/lib/api/services/invite.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { InviteInput, InviteResponse } from '@/types/invite.types';

export interface SendInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  onSent?: () => void;
}

export function SendInviteModal({ isOpen, onClose, companyId, onSent }: SendInviteModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'pm' | 'member'>('member');
  const [sent, setSent] = useState(false);

  const { mutate, isLoading, error, reset } = useMutation<InviteResponse, InviteInput>((input) =>
    inviteService.sendInvite(input),
  );

  if (!isOpen) return null;

  const handleClose = () => {
    reset();
    setEmail('');
    setRole('member');
    setSent(false);
    onClose();
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await mutate({ email: email.trim(), companyId, role });
      setSent(true);
      onSent?.();
    } catch {
      // Error surfaced via mutation.error
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
        <h2 className="text-xl font-semibold text-white">Invite team member</h2>
        <p className="mt-1 text-sm text-gray-400">
          Send an email invite to add someone to your company.
        </p>

        {sent ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-green-800/50 bg-green-950/40 px-4 py-3">
              <p className="text-sm text-green-400">
                Invite sent to <strong>{email}</strong>.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  reset();
                  setEmail('');
                  setRole('member');
                  setSent(false);
                }}
              >
                Send another
              </Button>
              <Button variant="orange" onClick={handleClose}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="inviteEmail"
                className="mb-1.5 block text-sm font-medium text-gray-300"
              >
                Email address
              </label>
              <Input
                id="inviteEmail"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teammate@company.com"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label
                htmlFor="inviteRole"
                className="mb-1.5 block text-sm font-medium text-gray-300"
              >
                Role
              </label>
              <select
                id="inviteRole"
                value={role}
                onChange={(e) => setRole(e.target.value as 'pm' | 'member')}
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="member">Member</option>
                <option value="pm">PM</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                PMs can create projects and view all team updates.
              </p>
            </div>

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
                {isLoading ? 'Sending…' : 'Send invite'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
