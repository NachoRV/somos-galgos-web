'use client';
import { useTranslations } from 'next-intl';
import { User, Home, Clock, Wallet, Heart, CheckCircle } from 'lucide-react';

export function AdoptionRequirementsSection() {
  const t = useTranslations('Adoption');

  const requirements = [
    { icon: User, title: t('req1Title'), description: t('req1Description') },
    { icon: Home, title: t('req2Title'), description: t('req2Description') },
    { icon: Clock, title: t('req3Title'), description: t('req3Description') },
    { icon: Wallet, title: t('req4Title'), description: t('req4Description') },
    { icon: Heart, title: t('req5Title'), description: t('req5Description') },
    { icon: CheckCircle, title: t('req6Title'), description: t('req6Description') },
  ];

  return (
    <section className="py-20 px-16 bg-base-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--color-primary)]">
            {t('requirementsTitle')}
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            {t('requirementsSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requirements.map((req, index) => {
            const Icon = req.icon;
            return (
              <div 
                key={index}
                className="p-6 bg-base-200 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--color-primary)]">
                    {req.title}
                  </h3>
                </div>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  {req.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
