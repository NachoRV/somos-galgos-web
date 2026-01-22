import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getDogs } from '@/lib/services/dogService';
import { DogCard } from '@/components/DogCard';

export async function DogsSection() {
  const t = await getTranslations('Home.Dogs');
  const dogs = await getDogs(['available', 'fostered', 'in_residence', 'in_treatment']);
  const displayDogs = dogs.slice(0, 6);
  
  return (
    <section className="py-20 px-16 bg-base-100">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-[var(--color-primary)]">
            {t('title')}
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayDogs.map((dog) => (
            <DogCard key={dog.id} dog={dog} />
          ))}
        </div>
        
        <div className="text-center">
          <Link 
            href="/galgos" 
            className="btn btn-secondary btn-lg px-8"
          >
            {t('viewAll')}
          </Link>
        </div>
      </div>
    </section>
  );
}
