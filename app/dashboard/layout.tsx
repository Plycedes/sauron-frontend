'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ProtectedRoute } from '@/lib/auth/ProtectedRoute';
import { useAuth } from '@/lib/auth/AuthContext';
import { CreateCompanyForm } from '@/components/onboarding/CreateCompanyForm';
import type { UserResponse, UserRole } from '@/types/user.types';

const PRIVILEGED_ROLES: UserRole[] = ['pm', 'company_admin'];

interface NavItem {
  href: string;
  label: string;
  privileged?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/projects', label: 'Projects' },
  { href: '/dashboard/my-updates', label: 'My Updates' },
  { href: '/dashboard/team', label: 'Team', privileged: true },
  { href: '/dashboard/rag', label: 'Ask PulseIQ', privileged: true },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardShell>{children}</DashboardShell>
    </ProtectedRoute>
  );
}

function DashboardShell({ children }: { children: ReactNode }) {
  const { user, companies, logout } = useAuth();

  if (!user) return null;

  const needsCompanySetup = companies.length === 0 && user.role !== 'super_admin';
  if (needsCompanySetup) {
    return <CreateCompanyForm />;
  }

  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar user={user} onLogout={logout} />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}

function Sidebar({ user, onLogout }: { user: UserResponse; onLogout: () => Promise<void> }) {
  const pathname = usePathname();
  const isPrivileged = PRIVILEGED_ROLES.includes(user.role);
  const visibleItems = NAV_ITEMS.filter((item) => !item.privileged || isPrivileged);
  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      await onLogout();
    } catch {
      setSigningOut(false);
    }
  };

  return (
    <aside className="flex w-60 flex-col border-r border-gray-800 bg-gray-900">
      {/* Brand */}
      <div className="flex h-14 items-center gap-2.5 border-b border-gray-800 px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-600">
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 text-white"
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
        <span className="text-base font-semibold text-white">Sauron</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 p-3">
        {visibleItems.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                active
                  ? 'block rounded-md bg-orange-900/40 px-3 py-2 text-sm font-medium text-orange-400'
                  : 'block rounded-md px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="border-t border-gray-800 p-3">
        <div className="flex items-center justify-between gap-2 rounded-md px-2 py-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{user.fullName}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={signingOut}
            className="shrink-0 rounded-md border border-gray-700 px-2.5 py-1.5 text-xs font-medium text-gray-400 hover:border-red-800 hover:text-red-400 disabled:opacity-50 transition-colors"
          >
            {signingOut ? '…' : 'Logout'}
          </button>
        </div>
      </div>
    </aside>
  );
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') {
    return pathname === '/dashboard';
  }
  return pathname === href || pathname.startsWith(href + '/');
}
