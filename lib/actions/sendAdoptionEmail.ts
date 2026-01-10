"use server";
import { Resend } from 'resend';
import { adoptionSchema, AdoptionFormData } from '@/lib/validations/adoption';

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = process.env.CONTACT_EMAIL || 'info@somosgalgos.es';

export async function sendAdoptionEmail(formData: AdoptionFormData) {
  // Validar datos
  const parsed = adoptionSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    // Construir el subject con el nombre del perro si está disponible
    const subject = formData.dogName 
      ? `[Adopción] Solicitud para ${formData.dogName}` 
      : '[Adopción] Nueva solicitud';

    // Enviar email a la organización
    await resend.emails.send({
      from: 'Adopción <no-reply@somosgalgos.es>',
      to: [TO_EMAIL],
      subject,
      replyTo: formData.email,
      text: `SOLICITUD DE ADOPCIÓN

${formData.dogName ? `Perro: ${formData.dogName} (ID: ${formData.dogId})\n` : ''}
DATOS PERSONALES
================
Nombre: ${formData.firstName} ${formData.lastName}
DNI/NIE: ${formData.idDocument}
Año de nacimiento: ${formData.birthYear}
Estado civil: ${formData.maritalStatus}
Profesión: ${formData.profession}

DIRECCIÓN
=========
Calle: ${formData.street}
Localidad: ${formData.city}
Código Postal: ${formData.postalCode}
Provincia: ${formData.province}

CONTACTO
========
Teléfono: ${formData.phone}
Email: ${formData.email}

${formData.additionalInfo ? `INFORMACIÓN ADICIONAL\n=====================\n${formData.additionalInfo}` : ''}`,
    });

    // Enviar confirmación al usuario
    await resend.emails.send({
      from: 'Somos Galgos <no-reply@somosgalgos.es>',
      to: [formData.email],
      subject: formData.dogName 
        ? `Solicitud de adopción de ${formData.dogName} recibida` 
        : 'Solicitud de adopción recibida',
      text: `Hola ${formData.firstName},

Gracias por tu interés en adoptar${formData.dogName ? ` a ${formData.dogName}` : ' uno de nuestros galgos'}. Hemos recibido tu solicitud y nos pondremos en contacto contigo lo antes posible para continuar con el proceso de adopción.

El proceso de adopción incluye:
1. Revisión de tu solicitud
2. Entrevista personal o telefónica
3. Visita al hogar (si procede)
4. Conocer al galgo
5. Seguimiento post-adopción

Te responderemos en un plazo de 2-3 días hábiles.

Un saludo,
El equipo de Somos Galgos`,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error enviando email de adopción:', error);
    return { error: error.message || 'Error enviando el email' };
  }
}