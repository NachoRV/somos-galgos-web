"use server";
import { sponsorshipSchema, SponsorshipFormData } from '@/lib/validations/sponsorship';

/**
 * Server Action: sendSponsorshipEmail
 * Envía los datos del formulario de apadrinamiento al endpoint de la API
 * que se encarga de guardar en Payload y enviar emails
 */
export async function sendSponsorshipEmail(formData: SponsorshipFormData) {
  console.log('sendSponsorshipEmail - formData recibido:', JSON.stringify(formData, null, 2));
  
  const parsed = sponsorshipSchema.safeParse(formData);
  if (!parsed.success) {
    console.warn('Validación fallida en Server Action:', parsed.error.flatten());
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    const bodyToSend = JSON.stringify(formData);
    console.log('Enviando body:', bodyToSend);
    
    const response = await fetch('/api/sponsorships', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: bodyToSend,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error desde API:', error);
      return { error: error.message || 'Error al procesar la solicitud' };
    }

    const result = await response.json();
    console.log('Solicitud de apadrinamiento guardada:', result.recordId);
    return { success: true };
  } catch (error: any) {
    console.error('Error enviando solicitud de apadrinamiento:', error);
    return { error: error.message || 'Error enviando la solicitud' };
  }
}
