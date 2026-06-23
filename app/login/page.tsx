'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
    const { login } = useAuth();
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await login({ userId, password });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
            setSubmitting(false);
        }
    };

    return (
        <div className="mx-auto mt-20 max-w-md rounded-lg bg-white p-8 shadow">
            <h1 className="mb-6 text-center text-2xl font-semibold text-gray-900">Sign in</h1>

            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label htmlFor="userId" className="mb-1 block text-sm font-medium text-gray-700">
                        User ID
                    </label>
                    <Input
                        id="userId"
                        type="text"
                        required
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <Input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? 'Signing in...' : 'Sign in'}
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-blue-600 hover:underline">
                    Register
                </Link>
            </p>
        </div>
    );
}
