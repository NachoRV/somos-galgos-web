import { useLocale, useTranslations } from 'next-intl';
import {
  VolunteerHeroSection,
  WhatIsVolunteerSection,
  VolunteerBenefitsSection,
  VolunteerFAQSection,
  VolunteerForm,
} from '@/components/volunteer';

export default function VoluntarioPage() {
  const locale = useLocale();
  const t = useTranslations('Volunteer');

  return (
    <main className="flex flex-col">
      <VolunteerHeroSection />
      <WhatIsVolunteerSection />
      <VolunteerBenefitsSection />
      <VolunteerFAQSection />

      {/* Volunteer Form Section */}
      <section className="py-16 px-4 bg-base-100">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            {t('whatIs.title')}
          </h2>
          <VolunteerForm locale={locale} />
        </div>
      </section>
    </main>
  );
}
