import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { routing } from '@/i18n/routing';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import background from '@/public/background.svg';
import { Footer } from '@/components/layout/Footer';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { SITE_URL, ORG_INFO, SOCIAL_LINKS } from '@/lib/constants';
import "./globals.css";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Somos Galgos - Rescate y Adopción de Galgos",
    template: "%s | Somos Galgos",
  },
  description: "Asociación sin ánimo de lucro dedicada al rescate, protección y adopción de galgos en Madrid. Apadrina, hazte socio o adopta.",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
  alternates: {
    languages: {
      es: `${SITE_URL}/es`,
      en: `${SITE_URL}/en`,
    },
  },
  authors: [
    {
      name: ORG_INFO.name,
      url: SITE_URL,
    },
  ],
  creator: ORG_INFO.name,
  category: 'Organizaciones sin ánimo de lucro',
  icons: {
    icon: '/icon.png',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: "Somos Galgos - Rescata un Galgo",
    description: ORG_INFO.description,
    url: SITE_URL,
    siteName: "Somos Galgos",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: "Somos Galgos - Asociación de rescate de galgos",
        type: 'image/png',
      },
    ],
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Somos Galgos - Rescata un Galgo",
    description: ORG_INFO.description,
    images: ['/og-image.png'],
    creator: '@somos_galgos',
  },
};



export default async function WebLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <div className="flex min-h-screen flex-col bg-primary text-secondary relative">
            <Image
              src={background}
              alt=""
              priority
              className="fixed top-0 left-0 w-full h-full -z-10"
              style={{ filter: 'blur(100px)' }}
            />
            {!process.env.PRO && <Header />}
            <main className="flex-1">{children}</main>
            <Footer />
            <GoogleAnalytics />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>


  );
}