import { getTranslations } from 'next-intl/server';
import { FosterHeroSection } from '@/components/foster/FosterHeroSection';
import { WhatIsFosterSection } from '@/components/foster/WhatIsFosterSection';
import { FosterForm } from '@/components/FosterForm';

interface AcogerPageProps {
  searchParams: Promise<{
    dogId?: string;
    dogName?: string;
  }>;
}

export default async function AcogerPage({ searchParams }: AcogerPageProps) {
  const t = await getTranslations('Foster');
  const params = await searchParams;

  return (
    <main className="min-h-screen">
      <FosterHeroSection />
      <WhatIsFosterSection />
      
      <section id="formulario" className="py-20 px-16 bg-base-100">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--color-primary)]">
              {t('title')}
            </h2>
            <p className="text-lg text-base-content/70">
              {t('subtitle')}
            </p>
          </div>
          
          {params.dogId && params.dogName && (
            <div className="bg-[var(--color-accent)]/10 border-2 border-[var(--color-accent)] rounded-lg p-6 mb-8">
              <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-2">
                {t('fosteringDog')}: {params.dogName}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                ID: {params.dogId}
              </p>
            </div>
          )}
          
          <FosterForm dogId={params.dogId} dogName={params.dogName} />
        </div>
      </section>
    </main>
  );
}