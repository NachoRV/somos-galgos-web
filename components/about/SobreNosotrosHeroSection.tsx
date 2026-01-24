'use client';
import Image from 'next/image';
import { LexicalContent } from '@/components/LexicalContent';

interface SobreNosotrosHeroSectionProps {
  title?: string;
  subtitle?: string;
  description?: any;
}

export function SobreNosotrosHeroSection({
  title = 'Sobre Nosotros',
  subtitle,
  description,
}: SobreNosotrosHeroSectionProps) {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center px-4 py-20 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-secondary)] pt-40">
      <div className="max-w-4xl mx-auto text-center z-10">
        <div className="mb-8">
          <Image
            src="/logo.webp"
            alt="Somos Galgos"
            width={120}
            height={120}
            className="mx-auto rounded-full border-4 border-white shadow-2xl"
            priority
          />
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
          {title}
        </h1>

        {subtitle && (
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}

        {description && (
          <div className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto prose-invert prose">
            <LexicalContent content={description} />
          </div>
        )}
      </div>
    </section>
  );
}
