import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getDogs } from '@/lib/services/dogService';
import { DogCard } from '@/components/DogCard';
import type { Dog } from '@/types/dog';

export default async function GalgosPage() {
  const t = await getTranslations('Dogs');
  const dogs = await getDogs();

  return (
    <div className="w-full min-h-screen">
      <section className="py-16 bg-[var(--color-bg-secondary)]">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-bold text-[var(--color-primary)] mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)]">
            {t('subtitle')}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dogs.map((dog) => (
              <DogCard 
                key={dog.id} 
                dog={dog}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[var(--color-secondary)]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-[var(--color-text-on-gold)] mb-4">
            {t('ctaTitle')}
          </h2>
          <p className="text-lg text-[var(--color-text-on-gold)] mb-8">
            {t('ctaDescription')}
          </p>
          <Link href="/adoptar" className="btn btn-primary">
            {t('ctaButton')}
          </Link>
        </div>
      </section>
    </div>
  );
}
