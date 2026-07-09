import type { ProjectStatus } from '@/types/project.types';

const STATUS_STYLES: Record<ProjectStatus, { label: string; classes: string }> = {
  active: { label: 'Active', classes: 'bg-green-900/50 text-green-400' },
  on_hold: { label: 'On hold', classes: 'bg-yellow-900/50 text-yellow-400' },
  completed: { label: 'Completed', classes: 'bg-orange-900/50 text-orange-400' },
  archived: { label: 'Archived', classes: 'bg-gray-800 text-gray-500' },
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
