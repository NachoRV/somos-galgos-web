import { setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { routing } from '@/i18n/routing';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';

// import { Footer } from '@/components/layout/Footer';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function WebLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  return (
    <div className="flex min-h-screen flex-col bg-primary text-secondary">
      {/* <Header /> */}
      <main className="flex-1">{children}</main>
      {/* <Footer /> */}
      <GoogleAnalytics />
    </div>
  );
}