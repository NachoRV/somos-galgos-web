import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getPayload } from 'payload';
import config from '@payload-config';
import { sponsorshipSchema, type SponsorshipFormData } from '@/lib/validations/sponsorship';

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = process.env.CONTACT_EMAIL || 'info@somosgalgos.es';

/**
 * Enviar email de notificación de apadrinamiento
 */
async function sendSponsorshipEmails(
  formData: SponsorshipFormData
) {
  try {
    const fullName = `${formData.firstName} ${formData.lastName1} ${formData.lastName2}`;
    const subject = formData.dogName
      ? `[APADRINAMIENTO] Solicitud de apadrinamiento para ${formData.dogName}`
      : `[APADRINAMIENTO] Nueva solicitud de apadrinamiento`;

    // Traducir frecuencia de pago
    const frequencyLabels: Record<string, string> = {
      monthly: 'Mensual',
      quarterly: 'Trimestral',
      semiannual: 'Semestral',
      annual: 'Anual',
    };
    const frequencyLabel = frequencyLabels[formData.fee_frequency || 'monthly'] || 'Mensual';

    // Email al administrador
    await resend.emails.send({
      from: 'Apadrinamiento <no-reply@somosgalgos.es>',
      to: [TO_EMAIL],
      subject,
      replyTo: formData.email,
      text: `SOLICITUD DE APADRINAMIENTO

${formData.dogName ? `Perro a apadrinar: ${formData.dogName}\n` : ''}
DATOS PERSONALES
================
Nombre: ${fullName}
DNI/NIE/NIF: ${formData.idDocument}

DIRECCIÓN
=========
Calle: ${formData.street}
Código Postal: ${formData.postalCode}
Población: ${formData.city}
Provincia: ${formData.province}

CONTACTO
========
Email: ${formData.email}
Teléfono: ${formData.phone}

INFORMACIÓN DE APADRINAMIENTO
=============================
Cuota mensual: ${formData.cuota}€
Frecuencia de pago: ${frequencyLabel}
IBAN: ${formData.iban}
Transferencia automática: ${formData.transferencia_automatica ? 'Sí' : 'No'}
Suscripción a boletín: ${formData.suscripcion_boletin ? 'Sí' : 'No'}
Autorización de cargos: ${formData.autorizacion_cargos ? 'Sí' : 'No'}
Política de privacidad: ${formData.politica_privacidad ? 'Sí' : 'No'}`,
    });

    // Email de confirmación al usuario
    await resend.emails.send({
      from: 'Somos Galgos <no-reply@somosgalgos.es>',
      to: [formData.email],
      subject: formData.dogName
        ? `Apadrinamiento de ${formData.dogName} - Solicitud recibida`
        : `Solicitud de apadrinamiento recibida`,
      text: `Hola ${formData.firstName},

Gracias por tu interés en apadrinar${formData.dogName ? ` a ${formData.dogName}` : ' uno de nuestros galgos'}. Hemos recibido tu solicitud y nos pondremos en contacto contigo lo antes posible para continuar con el proceso.

Te responderemos en un plazo de 2-3 días hábiles.

Un saludo,
El equipo de Somos Galgos`,
    });
  } catch (error: any) {
    console.error('Error enviando emails de apadrinamiento:', error);
    throw error;
  }
}

/**
 * POST /api/sponsorships
 * Crear un nuevo apadrinamiento
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📥 Body recibido en /api/sponsorships (formulario):', JSON.stringify(body, null, 2));

    // Validar datos del formulario
    const parsed = sponsorshipSchema.safeParse(body);
    if (!parsed.success) {
      console.warn('❌ Validación de formulario fallida:', parsed.error.flatten());
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    
    console.log('✅ Validación exitosa');

    const formData = parsed.data;

    console.log(`✅ Procesando solicitud de apadrinamiento:`, {
      email: formData.email,
      nombre: formData.firstName,
      cuota: formData.cuota,
      dogId: formData.dogId,
    });

    // Preparar datos para guardar en Payload
    const payloadData = {
      nombre: formData.firstName,
      apellido1: formData.lastName1,
      apellido2: formData.lastName2,
      documento_identidad: formData.idDocument,
      calle: formData.street,
      codigo_postal: formData.postalCode,
      ciudad: formData.city,
      provincia: formData.province,
      email: formData.email,
      telefono_contacto: formData.phone,
      nombre_perro_opcional: formData.dogName || null,
      cuota_mensual: formData.cuota,
      fee_frequency: formData.fee_frequency || 'monthly',
      iban: formData.iban,
      transferencia_automatica: formData.transferencia_automatica || false,
      suscripcion_boletin: formData.suscripcion_boletin || false,
      autorizacion_cargos: formData.autorizacion_cargos,
      politica_privacidad: formData.politica_privacidad,
      fecha_inicio: new Date().toISOString().split('T')[0],
      registration_date: new Date().toISOString().split('T')[0],
      perro: formData.dogId ? formData.dogId : null,
      sponsor_mode: 'padrino',
      status: 'en revision',
    };

    // Guardar en Payload CMS usando getPayload
    console.log('📝 Guardando en Payload CMS...');
    const payload = await getPayload({ config });
    const payloadResponse = await payload.create({
      collection: 'sponsorships',
      data: payloadData,
    });
    console.log('✅ Registro guardado en Payload:', payloadResponse.id);

    // Enviar emails
    console.log('📧 Enviando emails...');
    await sendSponsorshipEmails(formData);
    console.log('✅ Emails enviados correctamente');

    return NextResponse.json(
      {
        success: true,
        message: 'Apadrinamiento guardado y emails enviados correctamente',
        recordId: payloadResponse.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error en POST /api/sponsorships:', error);

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
 * GET /api/sponsorships?email=...
 * Obtener apadrinamientos por email
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

    console.log('Buscando apadrinamientos para:', email);

    const payload = await getPayload({ config });
    const response = await payload.find({
      collection: 'sponsorships',
      where: {
        email: {
          equals: email,
        },
      },
    });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error en GET /api/sponsorships:', error);

    return NextResponse.json(
      {
        error: 'Error al obtener apadrinamientos',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
