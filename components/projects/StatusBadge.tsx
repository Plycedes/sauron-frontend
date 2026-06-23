import type { ProjectStatus } from '@/types/project.types';

const STATUS_STYLES: Record<ProjectStatus, { label: string; classes: string }> = {
    active: { label: 'Active', classes: 'bg-green-100 text-green-800' },
    paused: { label: 'On hold', classes: 'bg-yellow-100 text-yellow-800' },
    completed: { label: 'Completed', classes: 'bg-blue-100 text-blue-800' },
    archived: { label: 'Archived', classes: 'bg-gray-100 text-gray-700' },
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
    const { label, classes } = STATUS_STYLES[status];
    return (
        <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${classes}`}
        >
            {label}
        </span>
    );
}