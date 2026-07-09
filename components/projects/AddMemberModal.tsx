'use client';

import { useState, type FormEvent } from 'react';
import { useMutation } from '@/lib/hooks/useMutation';
import * as projectService from '@/lib/api/services/project.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onAdded: () => void;
}

// TODO: backend needs a GET /companies/:id/users endpoint to render a proper
// searchable member picker. For now we add by exact userId.
export function AddMemberModal({ isOpen, onClose, projectId, onAdded }: AddMemberModalProps) {
  const [userId, setUserId] = useState('');

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
          Enter the userId of the teammate you want to add to this project.
        </p>
        <p className="mt-2 rounded-md bg-amber-950/60 border border-amber-800/50 p-2 text-xs text-amber-400">
          <strong>TODO:</strong> replace this text input with a searchable picker once the backend
          exposes <code>GET /companies/:id/users</code>.
        </p>

        <form onSubmit={onSubmit} className="mt-4 space-y-4">
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
