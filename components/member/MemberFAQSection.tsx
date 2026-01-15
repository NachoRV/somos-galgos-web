'use client';
import { useTranslations } from 'next-intl';

export function MemberFAQSection() {
  const t = useTranslations('Member');

  const faqs = [
    { question: 'faq1Question', answer: 'faq1Answer' },
    { question: 'faq2Question', answer: 'faq2Answer' },
    { question: 'faq3Question', answer: 'faq3Answer' },
    { question: 'faq4Question', answer: 'faq4Answer' },
  ];

  return (
    <section className="py-20 px-4 bg-base-100">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-[var(--color-primary)]">
          {t('faqTitle')}
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="collapse collapse-plus bg-base-200">
              <input type="radio" name="faq-accordion" defaultChecked={idx === 0} />
              <div className="collapse-title text-xl font-medium">
                {t(faq.question)}
              </div>
              <div className="collapse-content">
                <p className="text-[var(--color-text-secondary)]">{t(faq.answer)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
