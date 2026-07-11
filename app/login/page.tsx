'use client';

import { useState, type SubmitEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AttuneMark } from '@/components/brand/AttuneMark';

export default function LoginPage() {
  const { login } = useAuth();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
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
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-orange-500 via-orange-700 to-orange-950 p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-white" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-white" />
        </div>

        <div className="relative">
          {/* Eye icon */}
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <AttuneMark className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-4xl font-bold text-white tracking-tight">Attune</h1>
          <p className="mt-2 text-orange-200 text-lg">Stay in tune with your team.</p>
        </div>

        <div className="relative space-y-6">
          <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6">
            <p className="text-white/90 text-sm leading-relaxed">
              &ldquo;Real-time visibility across every project, every team, every update — in one
              place.&rdquo;
            </p>
          </div>
          <div className="flex gap-2">
            <div className="h-1.5 w-8 rounded-full bg-white" />
            <div className="h-1.5 w-3 rounded-full bg-white/40" />
            <div className="h-1.5 w-3 rounded-full bg-white/40" />
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-gray-950 px-6 py-16">
        {/* Mobile brand mark */}
        <div className="mb-8 flex flex-col items-center lg:hidden">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600">
            <AttuneMark className="h-7 w-7" />
          </div>
          <span className="mt-3 text-2xl font-bold text-white">Attune</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <p className="mt-1 text-gray-400 text-sm">Sign in to your account to continue.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label htmlFor="userId" className="mb-1.5 block text-sm font-medium text-gray-300">
                User ID
              </label>
              <Input
                id="userId"
                type="text"
                required
                placeholder="Enter your user ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-300">
                Password
              </label>
              <Input
                id="password"
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-950/60 border border-red-800/50 px-4 py-3">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="orange"
              className="w-full py-2.5 text-base font-semibold transition-all duration-150"
              disabled={submitting}
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
