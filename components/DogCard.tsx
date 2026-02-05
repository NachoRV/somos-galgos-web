'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { Dog } from '@/types/dog';
import { LexicalContent } from '@/components/LexicalContent';

interface DogCardProps {
  dog: Dog;
}

export function DogCard({ dog }: DogCardProps) {
  const t = useTranslations('Dogs');
  
  // Obtener la foto principal o la primera foto
  const primaryPhoto = dog.photos?.find((p) => p.is_primary) || dog.photos?.[0];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col">
      {/* Foto del perro */}
      <div className="aspect-square bg-[var(--color-bg-secondary)] relative overflow-hidden">
        {primaryPhoto?.url ? (
          <Image
            src={primaryPhoto.url}
            alt={`${dog.name} - ${dog.breed}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={primaryPhoto.url.includes('r2.cloudflarestorage.com') || primaryPhoto.url.includes('r2.dev')}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🐕
          </div>
        )}
      </div>

      {/* Información del perro */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-2">
          {dog.name}
        </h3>
        
        <div className="space-y-2 mb-4">
          <p className="text-sm text-[var(--color-text-secondary)]">
            <span className="font-semibold">{dog.breed}</span>
          </p>
          {dog.sex && (
            <p className="text-sm text-[var(--color-text-secondary)]">
              <span className="capitalize">{dog.sex === 'male' ? '♂️ Macho' : '♀️ Hembra'}</span>
            </p>
          )}
        </div>

        {/* Descripción web */}
        {dog.web_description && (
          <div className="text-[var(--color-text-secondary)] mb-6 text-sm line-clamp-3 flex-grow">
            <LexicalContent content={dog.web_description} />
          </div>
        )}

        {/* Botón */}
        <Link href={`/galgos/${dog.id}`} className="btn btn-primary w-full mt-auto">
          {t('knowMore')}
        </Link>
      </div>
    </div>
  );
}
