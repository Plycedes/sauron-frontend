'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { useApi } from '@/lib/hooks/useApi';
import * as projectService from '@/lib/api/services/project.service';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/projects/StatusBadge';
import { CreateProjectModal } from '@/components/projects/CreateProjectModal';
import type { ProjectResponse } from '@/types/project.types';

const PRIVILEGED_ROLES = ['pm', 'company_admin'] as const;

export default function ProjectsPage() {
    const { user, companies } = useAuth();
    const companyId = companies[0]?.id ?? null;
    const isPrivileged =
        !!user && (PRIVILEGED_ROLES as readonly string[]).includes(user.role);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, isLoading, error, refetch } = useApi<ProjectResponse[]>(
        () => projectService.getProjects(companyId ?? ''),
        { enabled: companyId !== null, deps: [companyId] },
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold text-gray-900">Projects</h1>
                {isPrivileged && (
                    <Button onClick={() => setIsModalOpen(true)}>+ New Project</Button>
                )}
            </div>

            {isLoading && <ProjectsSkeleton />}

            {error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-800">{error.message}</p>
                    <Button variant="secondary" size="sm" className="mt-2" onClick={() => void refetch()}>
                        Retry
                    </Button>
                </div>
            )}

            {!isLoading && !error && data && data.length === 0 && (
                <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                    <h2 className="text-lg font-semibold text-gray-900">No projects yet</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Create your first project to start tracking updates.
                    </p>
                    {isPrivileged && (
                        <Button className="mt-4" onClick={() => setIsModalOpen(true)}>
                            Create project
                        </Button>
                    )}
                </div>
            )}

            {!isLoading && !error && data && data.length > 0 && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {data.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}

            <CreateProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreated={() => void refetch()}
            />
        </div>
    );
}

function ProjectCard({ project }: { project: ProjectResponse }) {
    return (
        <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                <StatusBadge status={project.status} />
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                {project.description ?? 'No description.'}
            </p>
            <div className="mt-auto flex items-center justify-between pt-4">
                <span className="text-xs text-gray-500">
                    {project.members.length} member{project.members.length === 1 ? '' : 's'}
                </span>
                <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="text-sm font-medium text-blue-600 hover:underline"
                >
                    View →
                </Link>
            </div>
        </div>
    );
}

function ProjectsSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className="flex animate-pulse flex-col rounded-lg border border-gray-200 bg-white p-5"
                >
                    <div className="h-5 w-1/2 rounded bg-gray-200" />
                    <div className="mt-3 h-3 w-full rounded bg-gray-200" />
                    <div className="mt-2 h-3 w-5/6 rounded bg-gray-200" />
                    <div className="mt-6 h-3 w-1/3 rounded bg-gray-200" />
                </div>
            ))}
        </div>
    );
}
