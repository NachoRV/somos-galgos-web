'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export default function VolunteerFAQSection() {
  const t = useTranslations('Volunteer');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const faqs: FAQ[] = [
    {
      id: 'faq-1',
      question: t('faq.question1'),
      answer: t('faq.answer1'),
    },
    {
      id: 'faq-2',
      question: t('faq.question2'),
      answer: t('faq.answer2'),
    },
    {
      id: 'faq-3',
      question: t('faq.question3'),
      answer: t('faq.answer3'),
    },
    {
      id: 'faq-4',
      question: t('faq.question4'),
      answer: t('faq.answer4'),
    },
  ];

  return (
    <section className="py-16 px-4 bg-base-100">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          {t('faq.title')}
        </h2>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="collapse collapse-arrow border border-base-300 bg-base-100"
            >
              <input
                type="radio"
                name="faq-accordion"
                onChange={() =>
                  setExpandedId(expandedId === faq.id ? null : faq.id)
                }
                checked={expandedId === faq.id}
              />
              <div className="collapse-title text-xl font-semibold text-primary">
                {faq.question}
              </div>
              <div className="collapse-content">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
