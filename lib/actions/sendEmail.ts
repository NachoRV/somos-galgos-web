"use server";
import { Resend } from 'resend';
import { contactSchema, ContactFormData } from '@/lib/validations/contact';

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = process.env.CONTACT_EMAIL || 'info@somosgalgos.es';

export async function sendContactEmail(formData: ContactFormData) {
  // Validar datos
  const parsed = contactSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    // Enviar email a la organización
    await resend.emails.send({
      from: 'Contacto <no-reply@somosgalgos.es>',
      to: [TO_EMAIL],
      subject: `[Contacto] ${formData.subject}`,
      replyTo: formData.email,
      text: `Nombre: ${formData.name}\nEmail: ${formData.email}\nTeléfono: ${formData.phone}\nAsunto: ${formData.subject}\nMensaje:\n${formData.message}`,
    });

    // (Opcional) Enviar confirmación al usuario
    await resend.emails.send({
      from: 'Somos Galgos <no-reply@somosgalgos.es>',
      to: [formData.email],
      subject: 'Hemos recibido tu mensaje',
      text: `Hola ${formData.name},\n\nGracias por contactar con Somos Galgos. Hemos recibido tu mensaje y te responderemos lo antes posible.\n\nCopia de tu mensaje:\n${formData.message}\n\nUn saludo,\nEl equipo de Somos Galgos`,
    });

    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Error enviando el email' };
  }
}