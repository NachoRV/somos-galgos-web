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
    <main className="flex flex-col md:flex-row gap-8 items-start justify-center max-w-6xl mx-auto px-4 py-40">
      <div className="w-full md:w-auto md:flex-1 md:max-w-lg">
        <ContactForm />
      </div>
      <div className="w-full md:w-auto md:flex-1 md:max-w-md">
        <ContactInfo />
      </div>
    </main>
  );
}