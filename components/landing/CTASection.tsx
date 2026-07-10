import Link from 'next/link';

export function CTASection() {
  return (
    <section className="bg-gray-950 pb-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-orange-800/40 bg-gradient-to-br from-orange-600 via-orange-700 to-orange-900 px-8 py-14 text-center sm:px-16 sm:py-20">
          <div className="absolute inset-0 opacity-10" aria-hidden="true">
            <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white" />
            <div className="absolute -bottom-20 -right-10 h-60 w-60 rounded-full bg-white" />
          </div>

          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              See your team clearly.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-orange-100/90">
              Set up your first project in minutes. Get everyone on the same page today.
            </p>
            <div className="mt-8">
              <Link
                href="/register"
                className="inline-block rounded-md bg-white px-8 py-3 text-base font-semibold text-orange-700 shadow-sm transition-colors hover:bg-orange-50"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
