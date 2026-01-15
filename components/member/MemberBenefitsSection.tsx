'use client';
import { useTranslations } from 'next-intl';

export function MemberBenefitsSection() {
  const t = useTranslations('Member');

  const benefits = [
    { title: 'benefit1Title', desc: 'benefit1Desc' },
    { title: 'benefit2Title', desc: 'benefit2Desc' },
    { title: 'benefit3Title', desc: 'benefit3Desc' },
    { title: 'benefit4Title', desc: 'benefit4Desc' },
  ];

  return (
    <section className="py-20 px-4 bg-base-200">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-[var(--color-primary)]">
          {t('benefitsTitle')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="bg-base-100 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-3 text-[var(--color-accent)]">
                {t(benefit.title)}
              </h3>
              <p className="text-[var(--color-text-secondary)]">
                {t(benefit.desc)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
