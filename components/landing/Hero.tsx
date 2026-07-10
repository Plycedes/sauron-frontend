import Link from 'next/link';
import { SauronMark } from '@/components/brand/SauronMark';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-700 to-orange-950">
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute top-[-20%] left-[-10%] h-[70%] w-[70%] rounded-full bg-white" />
        <div className="absolute bottom-[-30%] right-[-10%] h-[65%] w-[65%] rounded-full bg-white" />
      </div>

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center sm:py-32 lg:py-40">
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm ring-1 ring-white/20">
          <SauronMark className="h-9 w-9" />
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          All-seeing project intelligence.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-orange-100/90 sm:text-xl">
          Real-time visibility across every project, every team, every update — in one place.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/register"
            className="rounded-md bg-white px-6 py-3 text-base font-semibold text-orange-700 shadow-sm transition-colors hover:bg-orange-50"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-white/30 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
