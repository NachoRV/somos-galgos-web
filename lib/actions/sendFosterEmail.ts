"use server";
import { fosterSchema, FosterFormData } from '@/lib/validations/foster';

/**
 * Server Action: sendFosterEmail
 * Envía los datos del formulario de acogida al endpoint de la API
 * que se encarga de guardar en Payload y enviar emails
 */
export async function sendFosterEmail(formData: FosterFormData) {
  const parsed = fosterSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/fosters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parsed.data),
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
