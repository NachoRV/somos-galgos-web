import { useTranslations } from 'next-intl';

export function SponsorshipFAQSection() {
  const t = useTranslations('Sponsorship');

  const faqs = [
    {
      question: t('faq1Question'),
      answer: t('faq1Answer'),
    },
    {
      question: t('faq2Question'),
      answer: t('faq2Answer'),
    },
    {
      question: t('faq3Question'),
      answer: t('faq3Answer'),
    },
    {
      question: t('faq4Question'),
      answer: t('faq4Answer'),
    },
  ];

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t('faqTitle')}</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="collapse collapse-plus border border-base-300 bg-base-100">
              <input type="checkbox" />
              <div className="collapse-title text-lg font-semibold">{faq.question}</div>
              <div className="collapse-content">
                <p className="text-base-content/80">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
