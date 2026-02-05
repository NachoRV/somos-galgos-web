import { Metadata } from 'next';
import { getPayload } from 'payload';
import config from '@payload-config';
import { SITE_URL, SEO_KEYWORDS } from '@/lib/constants';
import {
  HeroSection,
  DogsSection,
  HowToHelpSection,
  SuccessStoriesSection,
  ImpactCounterSection,
  BlogSection,
} from '@/components/home';

export const metadata: Metadata = {
  title: 'Rescate y Adopción de Galgos en Madrid',
  description: 'Asociación sin ánimo de lucro dedicada al rescate, protección y adopción de galgos. Apadrina, hazte socio o adopta un galgo hoy.',
  keywords: SEO_KEYWORDS,
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

export default async function WebHome() {
  const payload = await getPayload({ config });
  
  let impactData: any = null;
  let successStoriesData: any = null;
  
  try {
    impactData = await (payload.findGlobal as any)({ slug: 'impact-stats' });
    successStoriesData = await (payload.findGlobal as any)({ slug: 'success-stories' });
  } catch (error) {
    console.error('Error fetching globals:', error);
  }
  
  return (
    <>
      <HeroSection />
      <DogsSection />
      <HowToHelpSection />
      <SuccessStoriesSection 
        stories={successStoriesData?.stories} 
        enabled={successStoriesData?.enabled}
      />
      <ImpactCounterSection stats={impactData?.stats} />
      <BlogSection />
    </>
  );
}