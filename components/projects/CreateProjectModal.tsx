'use client';

import { useState, type FormEvent } from 'react';
import { useMutation } from '@/lib/hooks/useMutation';
import { useAuth } from '@/lib/auth/AuthContext';
import * as projectService from '@/lib/api/services/project.service';
import type { ProjectInput, ProjectResponse } from '@/types/project.types';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';

export interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreated: () => void;
}

export function CreateProjectModal({ isOpen, onClose, onCreated }: CreateProjectModalProps) {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const { mutate, isLoading, error, reset } = useMutation<ProjectResponse, ProjectInput>(
        (input) => projectService.createProject(input),
    );

    if (!isOpen) return null;

    const handleClose = () => {
        reset();
        setName('');
        setDescription('');
        onClose();
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) return;
        try {
            await mutate({
                companyId: user.companyId ?? '',
                name,
                description: description || undefined,
            });
            onCreated();
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
                <h2 className="text-xl font-semibold text-gray-900">New project</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Create a project to start tracking updates from your team.
                </p>

                <form onSubmit={onSubmit} className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="projectName" className="mb-1 block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <Input
                            id="projectName"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="projectDescription"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Description
                        </label>
                        <Textarea
                            id="projectDescription"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-sm text-red-600">{error.message}</p>}

                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create project'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
