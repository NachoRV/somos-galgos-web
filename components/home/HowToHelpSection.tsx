'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Heart, Home, HandHeart, Users } from 'lucide-react';

export function HowToHelpSection() {
  const t = useTranslations('Home.HowToHelp');
  
  const helpOptions = [
    {
      icon: Heart,
      titleKey: 'adoptTitle',
      descriptionKey: 'adoptDescription',
      href: '/adoptar',
      color: 'text-red-500',
    },
    {
      icon: Home,
      titleKey: 'fosterTitle',
      descriptionKey: 'fosterDescription',
      href: '/acoger',
      color: 'text-blue-500',
    },
    {
      icon: HandHeart,
      titleKey: 'sponsorTitle',
      descriptionKey: 'sponsorDescription',
      href: '/apadrinar',
      color: 'text-[var(--color-secondary)]',
    },
    {
      icon: Users,
      titleKey: 'volunteerTitle',
      descriptionKey: 'volunteerDescription',
      href: '/voluntario',
      color: 'text-[var(--color-accent)]',
    },
  ];
  
  return (
    <section className="py-20 px-16 bg-base-200">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-[var(--color-primary)]">
            {t('title')}
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {helpOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Link
                key={option.href}
                href={option.href}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="card-body items-center text-center">
                  <IconComponent className={`w-16 h-16 mb-4 ${option.color}`} />
                  <h3 className="card-title text-2xl mb-3">
                    {t(option.titleKey)}
                  </h3>
                  <p className="text-base-content/70">
                    {t(option.descriptionKey)}
                  </p>
                  <div className="card-actions mt-4">
                    <button className="btn btn-sm btn-outline btn-primary">
                      {t('learnMore')}
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
