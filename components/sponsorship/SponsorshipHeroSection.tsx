import { useTranslations } from 'next-intl';

export function SponsorshipHeroSection() {
  const t = useTranslations('Sponsorship');

  return (
    <section className="hero bg-gradient-to-r from-primary to-secondary text-primary-content py-12 md:py-16">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('heroTitle')}</h1>
          <p className="text-lg md:text-xl opacity-90">{t('heroSubtitle')}</p>
        </div>
      </div>
    </section>
  );
}
