import { LandingNav } from '@/components/landing/LandingNav';
import { Hero } from '@/components/landing/Hero';
import { FeatureGrid } from '@/components/landing/FeatureGrid';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950">
      <div className="relative">
        <LandingNav />
        <Hero />
      </div>
      <FeatureGrid />
      <CTASection />
      <Footer />
    </main>
  );
}
