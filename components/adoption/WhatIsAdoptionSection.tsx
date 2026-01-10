'use client';
import { useTranslations } from 'next-intl';
import { Heart, Shield, Clock, Award } from 'lucide-react';

export function WhatIsAdoptionSection() {
  const t = useTranslations('Adoption');

  const benefits = [
    { icon: Heart, text: t('whatIsBenefit1') },
    { icon: Shield, text: t('whatIsBenefit2') },
    { icon: Clock, text: t('whatIsBenefit3') },
    { icon: Award, text: t('whatIsBenefit4') },
  ];

  return (
    <section className="py-20 px-16 bg-base-200">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--color-primary)]">
            {t('whatIsTitle')}
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-3xl mx-auto leading-relaxed">
            {t('whatIsDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div 
                key={index}
                className="flex items-start gap-4 p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                </div>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                  {benefit.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
