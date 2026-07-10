'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { SauronMark } from '@/components/brand/SauronMark';

export function LandingNav() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <nav className="absolute inset-x-0 top-0 z-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm ring-1 ring-white/20">
            <SauronMark className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold text-white">Sauron</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {isLoading ? (
            <div className="h-9 w-24 rounded-md bg-white/10" aria-hidden="true" />
          ) : isAuthenticated ? (
            <Link
              href="/dashboard"
              className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm transition-colors hover:bg-orange-50"
            >
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-4 py-2 text-sm font-medium text-white/90 transition-colors hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm transition-colors hover:bg-orange-50"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
