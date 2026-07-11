'use client';

import { useState, type SubmitEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterPage() {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register({ fullName, email, userId, password, confirmPassword });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
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
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
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
          <h1 className="mt-4 text-4xl font-bold text-white tracking-tight">Attune</h1>
          <p className="mt-2 text-orange-200 text-lg">Stay in tune with your team.</p>
        </div>

        <div className="relative space-y-8">
          <div className="space-y-4">
            {[
              { icon: '📊', text: 'Track project health across your entire team' },
              { icon: '🔍', text: 'AI-powered insights from every update' },
              { icon: '⚡', text: 'Real-time visibility, zero blind spots' },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3">
                <span className="text-xl">{item.icon}</span>
                <p className="text-white/80 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="h-1.5 w-3 rounded-full bg-white/40" />
            <div className="h-1.5 w-8 rounded-full bg-white" />
            <div className="h-1.5 w-3 rounded-full bg-white/40" />
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-gray-950 px-6 py-16">
        {/* Mobile brand mark */}
        <div className="mb-8 flex flex-col items-center lg:hidden">
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
            <h2 className="text-2xl font-bold text-white">Create your account</h2>
            <p className="mt-1 text-gray-400 text-sm">Join your team on Attune.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-gray-300">
                Full name
              </label>
              <Input
                id="fullName"
                type="text"
                required
                placeholder="Jane Smith"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-300">
                Email
              </label>
              <Input
                id="email"
                type="email"
                required
                placeholder="jane@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label htmlFor="userId" className="mb-1.5 block text-sm font-medium text-gray-300">
                User ID
              </label>
              <Input
                id="userId"
                type="text"
                required
                placeholder="janesmith"
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
                placeholder="Choose a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-medium text-gray-300"
              >
                Confirm password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                required
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              className="w-full py-2.5 text-base font-semibold transition-all duration-150 mt-2"
              disabled={submitting}
            >
              {submitting ? 'Creating account…' : 'Create account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
