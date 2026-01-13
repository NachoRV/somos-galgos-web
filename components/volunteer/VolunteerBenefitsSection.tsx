import { useTranslations } from 'next-intl';

export default function VolunteerBenefitsSection() {
  const t = useTranslations('Volunteer');

  const benefits = [
    {
      title: t('benefits.benefit1.title'),
      description: t('benefits.benefit1.description'),
      icon: '❤️',
    },
    {
      title: t('benefits.benefit2.title'),
      description: t('benefits.benefit2.description'),
      icon: '🤝',
    },
    {
      title: t('benefits.benefit3.title'),
      description: t('benefits.benefit3.description'),
      icon: '🌟',
    },
  ];

  return (
    <section className="py-16 px-4 bg-base-200">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          {t('benefits.title')}
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="card bg-base-100 shadow-md">
              <div className="card-body">
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="card-title text-primary">{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
