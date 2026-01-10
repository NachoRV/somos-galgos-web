import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { routing } from '@/i18n/routing';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import background from '@/public/background.svg';
import { Footer } from '@/components/layout/Footer';

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
    <div className="flex min-h-screen flex-col bg-primary text-secondary relative">
      <Image
        src={background}
        alt=""
        priority
        className="fixed top-0 left-0 w-full h-full -z-10"
        style={{ filter: 'blur(100px)' }}
      />
      {!process.env.PRO && <Header />}
      <main className="flex-1 m-40">{children}</main>
      <Footer /> 
      <GoogleAnalytics />
    </div>
  );
}