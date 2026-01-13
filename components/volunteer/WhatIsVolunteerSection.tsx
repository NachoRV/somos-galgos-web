import { useTranslations } from 'next-intl';

export default function WhatIsVolunteerSection() {
  const t = useTranslations('Volunteer');

  return (
    <section className="py-16 px-4 bg-base-100">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          {t('whatIs.title')}
        </h2>

        <div className="prose prose-lg max-w-none">
          <p>{t('whatIs.description')}</p>
          <p>{t('whatIs.impact')}</p>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="card bg-base-200 shadow-md">
            <div className="card-body">
              <h3 className="card-title text-primary">
                {t('whatIs.flexibility.title')}
              </h3>
              <p>{t('whatIs.flexibility.description')}</p>
            </div>
          </div>

          <div className="card bg-base-200 shadow-md">
            <div className="card-body">
              <h3 className="card-title text-primary">
                {t('whatIs.community.title')}
              </h3>
              <p>{t('whatIs.community.description')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
