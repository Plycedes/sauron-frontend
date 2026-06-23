'use client';

import { useState, type FormEvent } from 'react';
import { useMutation } from '@/lib/hooks/useMutation';
import * as companyService from '@/lib/api/services/company.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { CompanyInput, CompanyResponse } from '@/types/company.types';

export function CreateCompanyForm() {
    const [name, setName] = useState('');
    const [domain, setDomain] = useState('');

    const { mutate, isLoading, error } = useMutation<CompanyResponse, CompanyInput>(
        (input) => companyService.createCompany(input),
    );

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await mutate({ name, domain: domain || undefined });
            // Reload so AuthContext re-hydrates with the new companyId on /auth/me.
            window.location.reload();
        } catch {
            // Error is surfaced via `error` state below; no additional handling needed.
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
                <h1 className="text-2xl font-semibold text-gray-900">Set up your company</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Create a company to start inviting teammates and tracking projects.
                </p>

                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="companyName" className="mb-1 block text-sm font-medium text-gray-700">
                            Company name
                        </label>
                        <Input
                            id="companyName"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="companyDomain" className="mb-1 block text-sm font-medium text-gray-700">
                            Domain
                        </label>
                        <Input
                            id="companyDomain"
                            type="text"
                            placeholder="example.com"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                        />
                        <p className="mt-1 text-xs text-gray-500">Optional.</p>
                    </div>

                    {error && <p className="text-sm text-red-600">{error.message}</p>}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create company'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
