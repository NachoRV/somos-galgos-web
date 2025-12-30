import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider  } from 'next-intl';
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
  title: "Somos Galgos",
  description: "Rescate y protección de galgos en Madrid",
  icons: {
    icon: '/icon.png',
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: "Somos Galgos",
    description: "Rescate y protección de galgos en Madrid",
    url: "https://somosgalgos.es",
    siteName: "Somos Galgos",
    images: [
      {
        url: '/icon.png',
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
};


type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
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
