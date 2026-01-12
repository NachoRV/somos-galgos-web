import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { adoptionSchema, type AdoptionFormData } from '@/lib/validations/adoption';

const resend = new Resend(process.env.RESEND_API_KEY);
const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000';
const PAYLOAD_API_KEY = process.env.PAYLOAD_API_KEY;
const TO_EMAIL = process.env.CONTACT_EMAIL || 'info@somosgalgos.es';

/**
 * Helper para hacer llamadas a la API REST de Payload de forma segura
 */
async function callPayloadAPI(endpoint: string, method: string, body?: any) {
  try {
    const response = await fetch(`${PAYLOAD_API_URL}/api${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `users API-Key ${PAYLOAD_API_KEY}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Payload API error: ${error.message || response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error(`Error calling Payload API (${endpoint}):`, error);
    throw error;
  }
}

/**
 * Enviar email de notificación (adopción o acogida)
 */
async function sendNotificationEmail(
  formData: AdoptionFormData,
  isFoster: boolean
) {
  try {
    const type = isFoster ? 'acogida' : 'adopción';
    const subject = formData.dogName
      ? `[${type.toUpperCase()}] Solicitud para ${formData.dogName}`
      : `[${type.toUpperCase()}] Nueva solicitud`;

    await resend.emails.send({
      from: isFoster ? 'Acogida <no-reply@somosgalgos.es>' : 'Adopción <no-reply@somosgalgos.es>',
      to: [TO_EMAIL],
      subject,
      replyTo: formData.email,
      text: `SOLICITUD DE ${type.toUpperCase()}

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

    // Confirmación al usuario
    await resend.emails.send({
      from: 'Somos Galgos <no-reply@somosgalgos.es>',
      to: [formData.email],
      subject: formData.dogName
        ? `Solicitud de ${type} de ${formData.dogName} recibida`
        : `Solicitud de ${type} recibida`,
      text: `Hola ${formData.firstName},

Gracias por tu interés en ${type === 'adopción' ? 'adoptar' : 'acoger'}${formData.dogName ? ` a ${formData.dogName}` : ' uno de nuestros galgos'}. Hemos recibido tu solicitud y nos pondremos en contacto contigo lo antes posible para continuar con el proceso.

Te responderemos en un plazo de 2-3 días hábiles.

Un saludo,
El equipo de Somos Galgos`,
    });
  } catch (error: any) {
    console.error('Error enviando email de notificación:', error);
    throw error;
  }
}

/**
 * POST /api/foster-adoptions
 * Crear una nueva solicitud de adopción o acogida
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos del formulario
    const parsed = adoptionSchema.safeParse(body);
    if (!parsed.success) {
      console.warn('Validación de formulario fallida:', parsed.error.flatten());
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const formData = parsed.data;
    const isFoster = body.type === 'foster'; // Frontend envía 'type' para distinguir

    console.log(`Procesando solicitud de ${isFoster ? 'acogida' : 'adopción'}:`, {
      email: formData.email,
      nombre: formData.firstName,
      dogId: formData.dogId,
    });

    // Preparar datos para guardar en Payload
    const payloadData = {
      nombre_contacto: `${formData.firstName} ${formData.lastName}`,
      documento_identidad: formData.idDocument,
      calle: formData.street,
      ciudad: formData.city,
      codigo_postal: formData.postalCode,
      provincia: formData.province,
      año_nacimiento: parseInt(formData.birthYear),
      estado_civil: formData.maritalStatus,
      profesion: formData.profession,
      telefono_contacto: formData.phone,
      email: formData.email,
      info_adicional: formData.additionalInfo || null,
      situacion: isFoster ? 'foster' : 'adoption',
      fecha_inicio: new Date().toISOString().split('T')[0], // Fecha actual
      perro: formData.dogId ? formData.dogId : null,
    };

    // Guardar en Payload CMS
    console.log('Guardando en Payload CMS...');
    const payloadResponse = await callPayloadAPI('/foster_adoptions', 'POST', payloadData);
    console.log('Registro guardado en Payload:', payloadResponse.id);

    // Enviar emails
    console.log('Enviando emails...');
    await sendNotificationEmail(formData, isFoster);
    console.log('Emails enviados correctamente');

    return NextResponse.json(
      {
        success: true,
        message: 'Solicitud guardada y emails enviados correctamente',
        recordId: payloadResponse.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error en POST /api/foster-adoptions:', error);

    return NextResponse.json(
      {
        error: 'Error al procesar la solicitud',
        message: error.message || 'Error desconocido',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/foster-adoptions?email=...
 * Obtener solicitudes por email (para futuras operaciones)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email requerido' },
        { status: 400 }
      );
    }

    console.log('Buscando solicitudes para:', email);

    const response = await callPayloadAPI(
      `/foster_adoptions?where[email][equals]=${encodeURIComponent(email)}`,
      'GET'
    );

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error en GET /api/foster-adoptions:', error);

    return NextResponse.json(
      {
        error: 'Error al obtener solicitudes',
        message: error.message,
      },
      { status: 500 }
    );
  }
}