import { useTranslations } from 'next-intl';
import Welcome from '@/components/Welcome';

export default function WebHome() {
  const t = useTranslations('HomePage');
  return (
    <section className="flex flex-col items-center justify-center py-16">
      <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
      <Welcome />
    </section>
  );
}     