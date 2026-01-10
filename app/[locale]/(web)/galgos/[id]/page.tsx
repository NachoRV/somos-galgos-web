import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getDogById } from '@/lib/services/dogService';
import { DogGallery } from '@/components/DogGallery';
import type { Dog } from '@/types/dog';

interface DogDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: DogDetailPageProps) {
  const { id } = await params;
  const dog = await getDogById(id);

  if (!dog) {
    return {
      title: 'Perro no encontrado',
      description: 'El perro que buscas no existe',
    };
  }

  return {
    title: `${dog.name} - Somos Galgos`,
    description: dog.web_description || 'Conoce más sobre este galgo',
    openGraph: {
      title: `${dog.name} - Somos Galgos`,
      description: dog.web_description,
      images: dog.photos && dog.photos.length > 0 ? [{ url: dog.photos[0].url }] : [],
    },
  };
}

export default async function DogDetailPage({ params }: DogDetailPageProps) {
  const { id } = await params;
  const t = await getTranslations('DogDetail');
  const dog = await getDogById(id);

  if (!dog) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0) age--;
    return age;
  };

  const age = calculateAge(dog.birth_date);

  return (
    <div className="w-full min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-[var(--color-bg-secondary)] py-4">
        <div className="max-w-6xl mx-auto px-4">
          <Link href="/galgos" className="text-[var(--color-accent)] hover:underline">
            ← {t('backToList')}
          </Link>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Galería */}
          <div className="md:col-span-2">
            <DogGallery photos={dog.photos || []} dogName={dog.name} />
          </div>

          {/* Información */}
          <div className="space-y-6">
            {/* Nombre y datos básicos */}
            <div>
              <h1 className="text-4xl font-bold text-[var(--color-primary)] mb-2">
                {dog.name}
              </h1>
              <div className="space-y-1 text-[var(--color-text-secondary)]">
                <p>
                  <span className="font-semibold">{t('breed')}:</span> {dog.breed}
                </p>
                <p>
                  <span className="font-semibold">{t('sex')}:</span>{' '}
                  {dog.sex === 'male' ? '♂️ Macho' : '♀️ Hembra'}
                </p>
                <p>
                  <span className="font-semibold">{t('age')}:</span> {age} {t('years')}
                </p>
                {/* <p>
                  <span className="font-semibold">{t('birthDate')}:</span>{' '}
                  {formatDate(dog.birth_date)}
                </p> */}
                <p>
                  <span className="font-semibold">{t('testedWithCats')}:</span>{' '}
                  {dog.tested_with_cats ? '✅ Sí' : '❌ No'}
                </p>
              </div>
            </div>
            {/* Datos de rescate */}
            <div className="border-t border-[var(--color-text-secondary)]/20 pt-6">
              <h3 className="font-bold text-[var(--color-primary)] mb-3">
                {t('rescueInfo')}
              </h3>
              <div className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                <p>
                  <span className="font-semibold">{t('entryDate')}:</span>{' '}
                  {formatDate(dog.entry_date)}
                </p>
              </div>
            </div>

            {/* Salud */}
            <div className="border-t border-[var(--color-text-secondary)]/20 pt-6">
              <h3 className="font-bold text-[var(--color-primary)] mb-3">
                {t('health')}
              </h3>
              <div className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                <p>
                  <span className="font-semibold">{t('neutered')}:</span>{' '}
                  {dog.neutering_date ? '✅' : '❌'}
                </p>
              </div>
            </div>
            {/* Estado */}
            <div className="border-t border-[var(--color-text-secondary)]/20 pt-6">
              <p className="text-sm text-[var(--color-text-secondary)]">
                <span className="font-semibold">{t('status')}:</span>
              </p>
              <div className="mt-2 inline-block bg-[var(--color-secondary)] text-[var(--color-text-on-gold)] px-4 py-2 rounded-full text-sm font-semibold">
                {t(`statuses.${dog.status}`)}
              </div>
            </div>

            {/* CTA */}
            <div className="border-t border-[var(--color-text-secondary)]/20 pt-6">
              <Link href={`/adoptar?dogId=${dog.id}&dogName=${encodeURIComponent(dog.name)}`} className="btn btn-primary w-full">
                {t('adoptButton')}
              </Link>
            </div>
          </div>
        </div>

        {/* Descripción completa */}
        <div className="mt-12 border-t border-[var(--color-text-secondary)]/20 pt-8">
          <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">
            {t('about')} {dog.name}
          </h2>
          <p className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap">
            {dog.web_description}
          </p>

          {dog.notes && (
            <div className="mt-6 p-4 bg-[var(--color-bg-secondary)] rounded-lg">
              <h3 className="font-bold text-[var(--color-primary)] mb-2">
                {t('notes')}
              </h3>
              <p className="text-[var(--color-text-secondary)] text-sm whitespace-pre-wrap">
                {dog.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
