import { AdoptionForm } from '@/components/AdoptionForm';
import { getTranslations } from 'next-intl/server';

interface AdoptarPageProps {
  searchParams: Promise<{
    dogId?: string;
    dogName?: string;
  }>;
}

export default async function AdoptarPage({ searchParams }: AdoptarPageProps) {
  const t = await getTranslations("Adoption");
  const params = await searchParams;
  
  return (
    <main className="min-h-screen py-20 px-16 bg-base-100">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--color-primary)]">
            {t('title')}
          </h1>
          <p className="text-lg text-base-content/70">
            {t('subtitle')}
          </p>
        </div>
        
        {params.dogId && params.dogName && (
          <div className="bg-[var(--color-accent)]/10 border-2 border-[var(--color-accent)] rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-2">
              {t('adoptingDog')}: {params.dogName}
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)]">
              ID: {params.dogId}
            </p>
          </div>
        )}
        
        <AdoptionForm dogId={params.dogId} dogName={params.dogName} />
      </div>
    </main>
  );
}