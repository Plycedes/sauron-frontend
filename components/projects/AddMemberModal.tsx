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

    const { mutate, isLoading, error, reset } = useMutation<void, string>(
        (id) => projectService.addProjectMember(projectId, id),
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={handleClose}
        >
            <div
                className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-semibold text-gray-900">Add member</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Enter the userId of the teammate you want to add to this project.
                </p>
                <p className="mt-2 rounded-md bg-yellow-50 p-2 text-xs text-yellow-800">
                    <strong>TODO:</strong> replace this text input with a searchable picker once the
                    backend exposes <code>GET /companies/:id/users</code>.
                </p>

                <form onSubmit={onSubmit} className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="memberUserId" className="mb-1 block text-sm font-medium text-gray-700">
                            User ID
                        </label>
                        <Input
                            id="memberUserId"
                            type="text"
                            required
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="e.g. jdoe"
                        />
                    </div>

                    {error && <p className="text-sm text-red-600">{error.message}</p>}

                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Adding...' : 'Add member'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}