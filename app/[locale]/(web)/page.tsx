import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import Welcome from '@/components/Welcome';
import { SITE_URL, ORG_INFO, SOCIAL_LINKS, SEO_KEYWORDS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Rescate y Adopción de Galgos en Madrid',
  description: 'Asociación sin ánimo de lucro dedicada al rescate, protección y adopción de galgos. Apadrina, hazte socio o adopta un galgo hoy.',
  keywords: SEO_KEYWORDS,
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Somos Galgos - Rescata un Galgo',
    description: 'Asociación sin ánimo de lucro para rescate y adopción de galgos. Apadrina, hazte socio o adopta.',
    url: `${SITE_URL}/es`,
    type: 'website',
    locale: 'es_ES',
    siteName: 'Somos Galgos',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Somos Galgos - Rescata un galgo',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Somos Galgos - Rescata un Galgo',
    description: 'Asociación sin ánimo de lucro para rescate y adopción de galgos.',
    images: ['/og-image.png'],
    creator: '@somos_galgos',
  },
  alternates: {
    canonical: `${SITE_URL}/es`,
    languages: {
      es: `${SITE_URL}/es`,
      en: `${SITE_URL}/en`,
    },
  },
};

export default function WebHome() {
  const t = useTranslations('HomePage');
  return (
    <section className="flex flex-col items-center justify-center py-16">
      <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
      <Welcome />
    </section>
  );
}