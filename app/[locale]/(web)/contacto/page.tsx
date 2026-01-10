import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import ContactInfo from '@/components/ContactInfo';

export const metadata: Metadata = {
  title: 'Contacto - Somos Galgos',
  description: 'Ponte en contacto con la asociación Somos Galgos para dudas, adopciones, voluntariado o cualquier consulta.',
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  return (
    <main className="flex flex-col md:flex-row gap-8 items-start justify-center py-44">
      <div className="flex-1 min-w-[320px]">
        <ContactForm />
      </div>
      <div className="flex-1 min-w-[280px]">
        <ContactInfo />
      </div>
    </main>
  );
}