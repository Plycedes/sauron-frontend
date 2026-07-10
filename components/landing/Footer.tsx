import Link from 'next/link';
import { SauronMark } from '@/components/brand/SauronMark';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-gray-800 bg-gray-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-600">
            <SauronMark className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-white">Sauron</span>
        </div>

        <p className="text-sm text-gray-500">© {year} Sauron. All rights reserved.</p>

        <div className="flex gap-6 text-sm">
          <Link href="/login" className="text-gray-400 transition-colors hover:text-orange-400">
            Sign in
          </Link>
          <Link href="/register" className="text-gray-400 transition-colors hover:text-orange-400">
            Get started
          </Link>
        </div>
      </div>
    </footer>
  );
}
