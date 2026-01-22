"use server";
import { adoptionSchema, AdoptionFormData } from '@/lib/validations/adoption';

/**
 * Server Action: sendAdoptionEmail
 * Envía los datos del formulario de adopción al endpoint de la API
 * que se encarga de guardar en Payload y enviar emails
 */
export async function sendAdoptionEmail(formData: AdoptionFormData) {
  const parsed = adoptionSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/foster-adoptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...parsed.data,
        type: 'adoption', // Identificar como solicitud de adopción
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error desde API:', error);
      return { error: error.message || 'Error al procesar la solicitud' };
    }

    const result = await response.json();
    console.log('Solicitud de adopción guardada:', result.recordId);
    return { success: true };
  } catch (error: any) {
    console.error('Error enviando solicitud de adopción:', error);
    return { error: error.message || 'Error enviando la solicitud' };
  }
}
