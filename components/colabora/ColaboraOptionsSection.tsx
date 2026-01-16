'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Heart, Home, HandHeart, Users, UserPlus, Share2 } from 'lucide-react';

export function ColaboraOptionsSection() {
  const t = useTranslations('Colabora.options');

  const colaborateOptions = [
    {
      icon: UserPlus,
      titleKey: 'memberTitle',
      descriptionKey: 'memberDescription',
      href: '/socio#formulario',
      color: 'text-[var(--color-primary)]',
    },
    {
      icon: HandHeart,
      titleKey: 'sponsorTitle',
      descriptionKey: 'sponsorDescription',
      href: '/apadrinar#formulario',
      color: 'text-[var(--color-secondary)]',
    },
    {
      icon: Heart,
      titleKey: 'donateTitle',
      descriptionKey: 'donateDescription',
      href: '/contacto#donar',
      color: 'text-red-500',
    },
    {
      icon: Home,
      titleKey: 'fosterTitle',
      descriptionKey: 'fosterDescription',
      href: '/acoger#formulario',
      color: 'text-blue-500',
    },
    {
      icon: Users,
      titleKey: 'volunteerTitle',
      descriptionKey: 'volunteerDescription',
      href: '/voluntario#formulario',
      color: 'text-[var(--color-accent)]',
    },
    {
      icon: Share2,
      titleKey: 'shareTitle',
      descriptionKey: 'shareDescription',
      href: '#compartir',
      color: 'text-green-500',
    },
  ];

  return (
    <section className="py-20 px-4 md:px-16 bg-base-200">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {colaborateOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Link
                key={option.href}
                href={option.href}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="card-body items-center text-center">
                  <IconComponent className={`w-16 h-16 mb-4 ${option.color}`} />
                  <h3 className="card-title text-xl mb-3">
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
