'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from './AuthContext';
import type { UserRole } from '@/types/user.types';

export function ProtectedRoute({
    children,
    allowedRoles,
}: {
    children: ReactNode;
    allowedRoles?: UserRole[];
}) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div
                    className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"
                    role="status"
                    aria-label="Loading"
                />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return (
            <div className="mx-auto mt-20 max-w-md rounded-lg bg-white p-6 text-center shadow">
                <h1 className="text-2xl font-semibold text-gray-900">Access denied</h1>
                <p className="mt-2 text-gray-600">
                    Your account does not have permission to view this page.
                </p>
                <Link
                    href="/dashboard"
                    className="mt-4 inline-block text-blue-600 hover:underline"
                >
                    Return to dashboard
                </Link>
            </div>
        );
    }

    return <>{children}</>;
}