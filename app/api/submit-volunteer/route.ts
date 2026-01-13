import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { volunteerSchema, type VolunteerFormData } from '@/lib/validations/volunteer';

const resend = new Resend(process.env.RESEND_API_KEY);
const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000';
const PAYLOAD_API_KEY = process.env.PAYLOAD_API_KEY;
const TO_EMAIL = process.env.CONTACT_EMAIL || 'info@somosgalgos.es';

/**
 * Enviar email de notificación al coordinador
 */
async function sendNotificationEmail(formData: VolunteerFormData) {
  try {
    // Mapeo de opciones de carnet
    const drivingLicenseMap: Record<string, string> = {
      si_carnet: 'Sí, tengo carnet.',
      si_carnet_coche: 'Sí, tengo carnet y coche propio.',
      no_carnet: 'No tengo carnet de conducir.',
    };

    const drivingLicenseText = drivingLicenseMap[formData.drivingLicense] || 'No especificado';

    // Email al coordinador de voluntarios
    console.log(`[EMAIL] Enviando notificación a ${TO_EMAIL}`);
    await resend.emails.send({
      from: 'Voluntarios <no-reply@somosgalgos.es>',
      to: [TO_EMAIL],
      subject: `[VOLUNTARIO] Nueva solicitud de ${formData.fullName}`,
      text: `NUEVA SOLICITUD DE VOLUNTARIADO

DATOS PERSONALES
================
Nombre Completo: ${formData.fullName}
DNI/NIE: ${formData.dni}
Fecha de Nacimiento: ${formData.birthDate}
Lugar de Residencia: ${formData.residenceLocation}
Teléfono de Contacto: ${formData.phone}
Carnet de Conducir: ${drivingLicenseText}

---
Por favor revisa esta solicitud en el panel de administración.`,
    });
    console.log(`[EMAIL] Notificación enviada al coordinador`);
  } catch (error: any) {
    console.error('[EMAIL] Error enviando email de notificación:', error);
    throw error;
  }
}

/**
 * POST /api/submit-volunteer
 * Crear una nueva solicitud de voluntariado
 */
export async function POST(request: NextRequest) {
  console.log('[POST] Iniciando POST /api/submit-volunteer');
  
  try {
    const body = await request.json();
    console.log('[POST] Datos recibidos del formulario:', JSON.stringify(body, null, 2));

    // Transformar snake_case a camelCase si es necesario
    const formData = {
      fullName: body.fullName || body.full_name,
      dni: body.dni,
      birthDate: body.birthDate || body.birth_date,
      residenceLocation: body.residenceLocation || body.residence_location,
      phone: body.phone,
      drivingLicense: body.drivingLicense || body.driving_license,
    };

    console.log('[POST] Datos transformados:', JSON.stringify(formData, null, 2));

    // Validar datos del formulario
    const parsed = volunteerSchema.safeParse(formData);
    if (!parsed.success) {
      console.warn('[POST] Validación fallida:', parsed.error.flatten());
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const validatedData = parsed.data;
    console.log('[POST] Datos validados correctamente');

    // Preparar datos para guardar en Payload (con snake_case para la BD)
    const payloadData: any = {
      full_name: validatedData.fullName,
      dni: validatedData.dni,
      birth_date: validatedData.birthDate,
      residence_location: validatedData.residenceLocation,
      phone: validatedData.phone,
      driving_license: validatedData.drivingLicense,
      status: 'en_revision', // Estado inicial
    };

    console.log('[POST] Datos para Payload:', JSON.stringify(payloadData, null, 2));

    // Guardar en Payload CMS mediante REST API
    console.log('[POST] Guardando en Payload CMS...');
    let payloadResponse;
    try {
      const headers: any = {
        'Content-Type': 'application/json',
      };

      // Agregar API key si está disponible
      if (PAYLOAD_API_KEY) {
        headers['Authorization'] = `Bearer ${PAYLOAD_API_KEY}`;
      }

      const payloadUrl = `${PAYLOAD_API_URL}/api/volunteers`;
      console.log(`[POST] Llamando a Payload en: ${payloadUrl}`);

      const response = await fetch(payloadUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payloadData),
      });

      console.log(`[POST] Payload respondió con status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[POST] Error de Payload - Status:', response.status);
        console.error('[POST] Error de Payload - Data:', JSON.stringify(errorData, null, 2));
        console.error('[POST] Datos que enviamos:', JSON.stringify(payloadData, null, 2));
        throw new Error(`Payload error ${response.status}: ${JSON.stringify(errorData)}`);
      }

      payloadResponse = await response.json();
      console.log('[POST] Registro guardado en Payload:', payloadResponse.id);
    } catch (payloadError: any) {
      console.error('[POST] Error guardando en Payload:', payloadError.message);
      return NextResponse.json(
        {
          error: 'Error al guardar en Payload',
          message: payloadError.message || 'Error desconocido',
        },
        { status: 500 }
      );
    }

    // Enviar email de notificación
    console.log('[POST] Enviando email de notificación...');
    try {
      await sendNotificationEmail(validatedData);
      console.log('[POST] Email enviado correctamente');
    } catch (emailError: any) {
      console.error('[POST] Error enviando email (continuando de todas formas):', emailError.message);
      // No lanzar error si falla el email, ya que el voluntario fue guardado
    }

    console.log('[POST] Completado exitosamente');
    return NextResponse.json(
      {
        success: true,
        message: 'Solicitud guardada correctamente',
        recordId: payloadResponse?.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[POST] Error fatal:', error);

    return NextResponse.json(
      {
        error: 'Error al procesar la solicitud',
        message: error.message || 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
