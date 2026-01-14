import { useTranslations } from 'next-intl';

export function WhatIsSponsorshipSection() {
  const t = useTranslations('Sponsorship');

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">{t('whatTitle')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-lg text-base-content/80">{t('whatDescription1')}</p>
            <p className="text-lg text-base-content/80">{t('whatDescription2')}</p>
          </div>
          <div className="space-y-4">
            <p className="text-lg text-base-content/80">{t('whatDescription3')}</p>
            <p className="text-lg text-base-content/80">{t('whatDescription4')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
