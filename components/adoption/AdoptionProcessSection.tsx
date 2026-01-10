'use client';
import { useTranslations } from 'next-intl';
import { FileText, MessageCircle, Home, Heart, Users } from 'lucide-react';

export function AdoptionProcessSection() {
  const t = useTranslations('Adoption');

  const steps = [
    { icon: FileText, title: t('step1Title'), description: t('step1Description') },
    { icon: MessageCircle, title: t('step2Title'), description: t('step2Description') },
    { icon: Home, title: t('step3Title'), description: t('step3Description') },
    { icon: Heart, title: t('step4Title'), description: t('step4Description') },
    { icon: Users, title: t('step5Title'), description: t('step5Description') },
  ];

  return (
    <section className="py-20 px-16 bg-base-200">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--color-primary)]">
            {t('processTitle')}
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-3xl mx-auto">
            {t('processSubtitle')}
          </p>
        </div>

        <div className="relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative mb-12 last:mb-0">
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="w-6 h-6 text-[var(--color-accent)]" />
                      <h3 className="text-xl font-bold text-[var(--color-primary)]">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-[var(--color-text-secondary)]">
                      {step.description}
                    </p>
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="absolute left-8 top-16 w-0.5 h-12 bg-[var(--color-accent)]/30" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
