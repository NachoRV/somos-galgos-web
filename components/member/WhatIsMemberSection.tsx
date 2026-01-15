'use client';
import { useTranslations } from 'next-intl';

export function WhatIsMemberSection() {
  const t = useTranslations('Member');

  return (
    <section className="py-20 px-4 bg-base-100">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[var(--color-primary)]">
          {t('whatTitle')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-lg text-[var(--color-text-secondary)]">
              {t('whatDescription1')}
            </p>
            <p className="text-lg text-[var(--color-text-secondary)]">
              {t('whatDescription2')}
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-lg text-[var(--color-text-secondary)]">
              {t('whatDescription3')}
            </p>
            <p className="text-lg text-[var(--color-text-secondary)]">
              {t('whatDescription4')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
