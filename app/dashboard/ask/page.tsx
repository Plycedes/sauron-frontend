'use client';

import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { ProtectedRoute } from '@/lib/auth/ProtectedRoute';
import { useAuth } from '@/lib/auth/AuthContext';
import { useApi } from '@/lib/hooks/useApi';
import { useMutation } from '@/lib/hooks/useMutation';
import * as projectService from '@/lib/api/services/project.service';
import * as ragService from '@/lib/api/services/rag.service';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { QueryResultCard } from '@/components/rag/QueryResultCard';
import type { ProjectResponse } from '@/types/project.types';
import type { RagQueryInput, RagQueryResult } from '@/types/rag.types';

interface HistoryEntry {
  id: string;
  question: string;
  result: RagQueryResult;
}

const EXAMPLE_QUESTIONS = [
  'What did the team work on this week?',
  'Are there any blockers?',
  'How is progress looking overall?',
];

export default function AskPage() {
  return (
    <ProtectedRoute allowedRoles={['pm', 'company_admin']}>
      <AskContent />
    </ProtectedRoute>
  );
}

function AskContent() {
  const { activeCompany } = useAuth();
  const companyId = activeCompany?.id ?? null;

  const [question, setQuestion] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [userId, setUserId] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const { data: projects } = useApi<ProjectResponse[]>(
    () => projectService.getProjects(companyId ?? ''),
    { enabled: companyId !== null, deps: [companyId] },
  );

  const { mutate, isLoading, error, reset } = useMutation<RagQueryResult, RagQueryInput>((input) =>
    ragService.queryRag(input),
  );

  const activeFilterCount =
    (projectId ? 1 : 0) + (userId ? 1 : 0) + (dateFrom ? 1 : 0) + (dateTo ? 1 : 0);

  const clearFilters = () => {
    setProjectId('');
    setUserId('');
    setDateFrom('');
    setDateTo('');
  };

  const submit = async () => {
    const trimmed = question.trim();
    if (!trimmed || isLoading || !companyId) return;

    try {
      const result = await mutate({
        question: trimmed,
        companyId,
        projectId: projectId || undefined,
        userId: userId.trim() || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
      setHistory((prev) => [{ id: `${Date.now()}`, question: trimmed, result }, ...prev]);
      setQuestion('');
    } catch {
      // Error surfaced via mutation.error below.
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submit();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void submit();
    }
  };

  const showEmpty = history.length === 0 && !isLoading;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">Ask Sauron</h1>
        <p className="mt-1 text-sm text-gray-400">
          Query your team&apos;s updates in natural language. Results are grounded in cited sources.
        </p>
      </div>

      <section className="rounded-lg border border-gray-800 bg-gray-900">
        <button
          type="button"
          onClick={() => setFilterOpen((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3 text-left"
        >
          <span className="flex items-center gap-2 text-sm font-medium text-gray-200">
            Filters
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-orange-900/50 px-2 py-0.5 text-xs font-medium text-orange-400">
                {activeFilterCount} active
              </span>
            )}
          </span>
          <span className="text-xs text-gray-500">{filterOpen ? 'Hide' : 'Show'}</span>
        </button>

        {filterOpen && (
          <div className="space-y-4 border-t border-gray-800 px-4 py-4">
            <div>
              <label
                htmlFor="filterProject"
                className="mb-1 block text-xs font-medium text-gray-400"
              >
                Project
              </label>
              <select
                id="filterProject"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All projects</option>
                {(projects ?? []).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="filterUser" className="mb-1 block text-xs font-medium text-gray-400">
                User ID
              </label>
              <Input
                id="filterUser"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g. jdoe"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-orange-500 focus:border-orange-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Filter results to a specific teammate by userId.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="filterFrom"
                  className="mb-1 block text-xs font-medium text-gray-400"
                >
                  From
                </label>
                <Input
                  id="filterFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label htmlFor="filterTo" className="mb-1 block text-xs font-medium text-gray-400">
                  To
                </label>
                <Input
                  id="filterTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {activeFilterCount > 0 && (
              <Button variant="secondary" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        )}
      </section>

      <form onSubmit={onSubmit} className="rounded-lg border border-gray-800 bg-gray-900 p-4">
        <Textarea
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask anything about your team's progress..."
          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-orange-500 focus:border-orange-500"
        />
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Press{' '}
            <kbd className="rounded border border-gray-700 bg-gray-800 px-1 text-gray-300">
              Enter
            </kbd>{' '}
            to ask,{' '}
            <kbd className="rounded border border-gray-700 bg-gray-800 px-1 text-gray-300">
              Shift+Enter
            </kbd>{' '}
            for newline.
          </p>
          <Button
            variant="orange"
            type="submit"
            disabled={isLoading || question.trim().length === 0 || !companyId}
          >
            {isLoading ? 'Thinking...' : 'Ask'}
          </Button>
        </div>
      </form>

      {isLoading && <ThinkingIndicator />}

      {error && (
        <div className="rounded-md border border-red-800/50 bg-red-950/60 p-4">
          <p className="text-sm text-red-400">{error.message}</p>
          <Button variant="secondary" size="sm" className="mt-2" onClick={() => reset()}>
            Dismiss
          </Button>
        </div>
      )}

      {showEmpty && (
        <div className="rounded-lg border border-dashed border-gray-700 bg-gray-900 p-10 text-center">
          <h2 className="text-lg font-semibold text-white">
            Ask anything about your team&apos;s progress
          </h2>
          <p className="mt-1 text-sm text-gray-400">Try one of these to get started:</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {EXAMPLE_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuestion(q)}
                className="rounded-full border border-gray-700 bg-gray-800 px-3 py-1 text-sm text-gray-300 hover:border-orange-500 hover:text-orange-400 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="space-y-4">
          {history.map((entry) => (
            <QueryResultCard
              key={entry.id}
              question={entry.question}
              answer={entry.result.answer}
              sources={entry.result.sources}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-orange-800/50 bg-orange-950/40 px-4 py-3">
      <span className="flex gap-1" aria-hidden>
        <span className="h-2 w-2 animate-bounce rounded-full bg-orange-500 [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-orange-500 [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-orange-500" />
      </span>
      <p className="text-sm font-medium text-orange-300">Thinking...</p>
    </div>
  );
}
