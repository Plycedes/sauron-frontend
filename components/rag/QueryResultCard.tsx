'use client';

import { cn } from '@/lib/utils/cn';
import type { RagSource } from '@/types/rag.types';

export interface QueryResultCardProps {
  question: string;
  answer: string;
  sources: RagSource[];
  confidence?: number;
}

export function QueryResultCard({ question, answer, sources, confidence }: QueryResultCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">You asked</p>
        <p className="mt-1 text-sm text-gray-900">{question}</p>
      </div>

      <div className="px-4 py-4">
        <p className="whitespace-pre-wrap text-sm text-gray-900">{answer}</p>
        {confidence !== undefined && confidence > 0 && (
          <p className="mt-3 text-xs text-gray-500">Confidence: {Math.round(confidence * 100)}%</p>
        )}
      </div>

      {sources.length > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
          <details>
            <summary
              className={cn(
                'flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-blue-700',
                'hover:text-blue-800',
              )}
            >
              <span aria-hidden>▶</span>
              View sources ({sources.length})
            </summary>
            <ul className="mt-3 space-y-2">
              {sources.map((source, i) => (
                <SourceRow key={`${source.updateId}-${i}`} source={source} index={i} />
              ))}
            </ul>
          </details>
        </div>
      )}
    </article>
  );
}

function SourceRow({ source, index }: { source: RagSource; index: number }) {
  return (
    <li className="rounded border border-gray-200 bg-white p-3 text-sm">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
        <span className="font-mono">#{index + 1}</span>
        <span>·</span>
        <span>
          project <span className="font-mono">{source.projectId}</span>
        </span>
        <span>·</span>
        <span>
          author <span className="font-mono">{source.userId}</span>
        </span>
        {source.date && (
          <>
            <span>·</span>
            <span>{new Date(source.date).toLocaleDateString()}</span>
          </>
        )}
        {source.category && (
          <span className="ml-auto rounded bg-blue-50 px-2 py-0.5 font-medium text-blue-700 capitalize">
            {source.category}
          </span>
        )}
      </div>
      <p className="whitespace-pre-wrap text-gray-900">{source.text}</p>
    </li>
  );
}
