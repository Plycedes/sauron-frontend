'use client';

import { cn } from '@/lib/utils/cn';
import type { UpdateConfidence } from '@/types/update.types';

export interface ConfidenceToggleProps {
    value: UpdateConfidence | null;
    onChange: (value: UpdateConfidence) => void;
}

const OPTIONS: { value: UpdateConfidence; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
];

export function ConfidenceToggle({ value, onChange }: ConfidenceToggleProps) {
    return (
        <div className="inline-flex" role="radiogroup" aria-label="Confidence">
            {OPTIONS.map((opt, i) => {
                const selected = value === opt.value;
                return (
                    <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => onChange(opt.value)}
                        className={cn(
                            'px-4 py-2 text-sm font-medium border border-gray-300',
                            i > 0 && '-ml-px',
                            i === 0 && 'rounded-l-md',
                            i === OPTIONS.length - 1 && 'rounded-r-md',
                            selected
                                ? 'bg-blue-600 text-white border-blue-600 z-10 relative'
                                : 'bg-white text-gray-700 hover:bg-gray-50',
                        )}
                    >
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
}
