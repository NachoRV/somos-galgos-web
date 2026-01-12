"use server";
import { adoptionSchema, AdoptionFormData } from '@/lib/validations/adoption';

/**
 * Server Action: sendFosterEmail
 * Envía los datos del formulario de acogida al endpoint de la API
 * que se encarga de guardar en Payload y enviar emails
 */
export async function sendFosterEmail(formData: AdoptionFormData) {
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
        ...formData,
        type: 'foster', // Identificar como solicitud de acogida
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error desde API:', error);
      return { error: error.message || 'Error al procesar la solicitud' };
    }

    const result = await response.json();
    console.log('Solicitud de acogida guardada:', result.recordId);
    return { success: true };
  } catch (error: any) {
    console.error('Error enviando solicitud de acogida:', error);
    return { error: error.message || 'Error enviando la solicitud' };
  }
}
