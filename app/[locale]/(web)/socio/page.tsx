import { SponsorshipForm } from '@/components/SponsorshipForm';
import { getTranslations } from 'next-intl/server';
import {
  MemberHeroSection,
  WhatIsMemberSection,
  MemberBenefitsSection,
  MemberFAQSection,
} from '@/components/member';

export default async function SocioPage() {
  const t = await getTranslations("Member");
  
  return (
    <main className="min-h-screen">
      <MemberHeroSection />
      <WhatIsMemberSection />
      <MemberBenefitsSection />
      <MemberFAQSection />
      
      <section id="formulario" className="py-20 px-16 bg-base-100">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--color-primary)]">
              {t('formTitle')}
            </h2>
            <p className="text-lg text-base-content/70">
              {t('formSubtitle')}
            </p>
          </div>
          
          <SponsorshipForm sponsorMode="socio" />
        </div>
      </section>
    </main>
  );
}