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
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar user={user} onLogout={logout} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

function Sidebar({ user }: { user: UserResponse }) {
  const pathname = usePathname();
  const isPrivileged = PRIVILEGED_ROLES.includes(user.role);
  const visibleItems = NAV_ITEMS.filter((item) => !item.privileged || isPrivileged);

  return (
    <aside className="flex w-60 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-14 items-center border-b border-gray-200 px-6">
        <span className="text-lg font-semibold text-gray-900">PulseIQ</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {visibleItems.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                active
                  ? 'block rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700'
                  : 'block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100'
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

function TopBar({ user, onLogout }: { user: UserResponse; onLogout: () => Promise<void> }) {
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
    <header className="flex h-14 items-center justify-end gap-4 border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium text-gray-900">{user.name}</span>
        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium uppercase text-gray-700">
          {user.role.replace('_', ' ')}
        </span>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        disabled={signingOut}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-red-600 disabled:opacity-50"
      >
        {signingOut ? 'Signing out...' : 'Logout'}
      </button>
    </header>
  );
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') {
    return pathname === '/dashboard';
  }
  return pathname === href || pathname.startsWith(href + '/');
}
