'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Heart, Home, HandHeart, Users, Coins } from 'lucide-react';
import { ColaboraOptionsSection } from '../colabora/ColaboraOptionsSection';

export function HowToHelpSection() {
  const t = useTranslations('Home.HowToHelp');
  

  return (
    <section className="py-20 px-16 bg-base-200">
      <div className="container mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-4xl font-bold text-[var(--color-primary)]">
            {t('title')}
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
        <ColaboraOptionsSection />
      </div>
    </section>
  );
}
