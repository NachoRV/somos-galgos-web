import { useTranslations } from 'next-intl';

export function SponsorshipBenefitsSection() {
  const t = useTranslations('Sponsorship');

  const benefits = [
    {
      icon: '📸',
      title: t('benefit1Title'),
      description: t('benefit1Desc'),
    },
    {
      icon: '📧',
      title: t('benefit2Title'),
      description: t('benefit2Desc'),
    },
    {
      icon: '❤️',
      title: t('benefit3Title'),
      description: t('benefit3Desc'),
    },
    {
      icon: '🌍',
      title: t('benefit4Title'),
      description: t('benefit4Desc'),
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-base-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t('benefitsTitle')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="card-title text-lg">{benefit.title}</h3>
                <p className="text-base-content/80">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
