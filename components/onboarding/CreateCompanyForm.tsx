'use client';

import { useState, type FormEvent } from 'react';
import { useMutation } from '@/lib/hooks/useMutation';
import { useAuth } from '@/lib/auth/AuthContext';
import * as companyService from '@/lib/api/services/company.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { CompanyInput, CompanyResponse } from '@/types/company.types';

export function CreateCompanyForm() {
  const { refreshCompanies } = useAuth();
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');

  const { mutate, isLoading, error } = useMutation<CompanyResponse, CompanyInput>((input) =>
    companyService.createCompany(input),
  );

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await mutate({ name, domain: domain || undefined });
      await refreshCompanies();
    } catch {
      // Error is surfaced via `error` state below; no additional handling needed.
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-6 py-16">
      {/* Brand mark */}
      <div className="mb-8 flex flex-col items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600">
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </div>
        <span className="mt-3 text-2xl font-bold text-white">Attune</span>
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Set up your company</h1>
          <p className="mt-1 text-sm text-gray-400">
            Create a company to start inviting teammates and tracking projects.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label htmlFor="companyName" className="mb-1.5 block text-sm font-medium text-gray-300">
              Company name
            </label>
            <Input
              id="companyName"
              type="text"
              required
              placeholder="Acme Corp"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label
              htmlFor="companyDomain"
              className="mb-1.5 block text-sm font-medium text-gray-300"
            >
              Domain
              <span className="ml-1.5 text-xs font-normal text-gray-500">Optional</span>
            </label>
            <Input
              id="companyDomain"
              type="text"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-950/60 border border-red-800/50 px-4 py-3">
              <p className="text-sm text-red-400">{error.message}</p>
            </div>
          )}

          <Button
            type="submit"
            variant="orange"
            className="w-full py-2.5 text-base font-semibold transition-all duration-150"
            disabled={isLoading}
          >
            {isLoading ? 'Creating…' : 'Create company'}
          </Button>
        </form>
      </div>
    </div>
  );
}
