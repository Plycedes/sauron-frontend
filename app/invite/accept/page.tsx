'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import * as inviteService from '@/lib/api/services/invite.service';
import { useAuth } from '@/lib/auth/AuthContext';

export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, refreshCompanies } = useAuth();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    token ? 'loading' : 'error',
  );
  const [errorMsg, setErrorMsg] = useState(token ? '' : 'No invite token found in the URL.');

  useEffect(() => {
    if (!token) return;
    if (!isAuthenticated) {
      router.replace(`/login?redirect=/invite/accept?token=${token}`);
      return;
    }

    inviteService
      .acceptInvite(token)
      .then(async () => {
        await refreshCompanies();
        setStatus('success');
        setTimeout(() => router.push('/dashboard'), 2000);
      })
      .catch((err: Error) => {
        setErrorMsg(err.message ?? 'Failed to accept invite.');
        setStatus('error');
      });
  }, [token, isAuthenticated, router, refreshCompanies]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-6">
      <div className="w-full max-w-sm rounded-lg border border-gray-800 bg-gray-900 p-8 text-center">
        {status === 'loading' ? (
          <>
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
            <p className="text-sm text-gray-400">Accepting your invite…</p>
          </>
        ) : status === 'success' ? (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-900/40">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="h-6 w-6 text-green-400"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-white">You&apos;re in!</h1>
            <p className="mt-1 text-sm text-gray-400">Redirecting to your dashboard…</p>
          </>
        ) : (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-900/40">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="h-6 w-6 text-red-400"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-white">Invite failed</h1>
            <p className="mt-1 text-sm text-gray-400">{errorMsg}</p>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="mt-4 text-sm text-orange-400 hover:text-orange-300"
            >
              Go to dashboard →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
