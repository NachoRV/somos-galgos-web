import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider  } from 'next-intl';
import { SITE_URL, ORG_INFO, SOCIAL_LINKS } from '@/lib/constants';
import "./globals.css";

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


type Props = {
  children: React.ReactNode;
  params: Promise<{}>;
};

export default async function LocaleLayout({
  children,
  params
}: Props) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
