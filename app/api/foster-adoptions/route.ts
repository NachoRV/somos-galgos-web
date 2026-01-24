import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { adoptionSchema, type AdoptionFormData } from '@/lib/validations/adoption';

const resend = new Resend(process.env.RESEND_API_KEY);
const PAYLOAD_API_URL = '/' //|| 'http://localhost:3000';
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
    if (formData.email) {
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
    }
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

    // Preparar datos para guardar en Payload (mapeo completo de todos los campos)
    const payloadData = {
      // Datos del Perro (requeridos)
      situacion: isFoster ? 'foster' : 'adoption',
      fecha_inicio: new Date().toISOString().split('T')[0],
      perro: formData.dogId ? formData.dogId : null,

      // Paso 1: Datos Personales
      nombre_contacto: `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
      documento_identidad: formData.idDocument || null,
      email: formData.email || null,
      telefono_contacto: formData.phone || null,
      otras_formas_contacto: formData.otherContact || null,
      año_nacimiento: formData.birthYear ? parseInt(formData.birthYear) : null,
      estado_civil: formData.maritalStatus || null,
      profesion: formData.profession || null,
      trabaja_actualmente: (formData as any).currentlyWorking || null,
      estabilidad_trabajo: (formData as any).workStability || null,
      horario_trabajo: (formData as any).workSchedule || null,
      hobbies: (formData as any).hobbies || null,

      // Paso 2: Domicilio
      calle: formData.street || null,
      codigo_postal: formData.postalCode || null,
      ciudad: formData.city || null,
      provincia: formData.province || null,

      // Paso 3: Vivienda
      tipo_vivienda: formData.housingType || null,
      metros_vivienda: formData.housingSize || null,
      tiene_jardin: formData.hasGarden || null,
      jardin_vallado: formData.gardenFenced || null,
      altura_valla: formData.fenceHeight || null,
      vivienda_propia: formData.housingOwnership || null,
      permiso_arrendador: formData.rentalPermission || null,
      limite_animales_contrato: formData.rentalAnimalLimit || null,
      vecinos_contra: formData.neighborsConcern || null,

      // Paso 4: Familia
      habitantes_casa: formData.household || null,
      numero_hijos: formData.childrenCount || null,
      edades_hijos: formData.childrenAges || null,
      familia_acuerda: formData.familyAgrees || null,
      alergias_familia: formData.familyAllergies || null,
      descripcion_alergias: formData.allergiesDescription || null,

      // Paso 5: Motivación y Experiencia
      razon_adopcion: formData.adoptionReason || null,
      proposito_adopcion: formData.adoptionPurpose || null,
      quien_decide: formData.adoptionDecision || null,
      dispuesto_buscar: formData.willingToFetch || null,
      cuando_recibir: formData.adoptionTimeline || null,
      necesidades_perro: formData.knownNeeds || null,
      contacto_otra_asociacion: formData.previousContact || null,
      ha_adoptado_antes: formData.previousDogs || null,
      experiencia_previa: formData.previousExperience || null,
      animales_actuales: formData.currentPets || null,

      // Paso 6: Cuidados y Paseos
      alimentacion_adecuada: formData.appropriateFood || null,
      gastos_perro: formData.dogExpenses || null,
      gastos_medicos: formData.medicalExpenses || null,
      ubicacion_solo: formData.aloneLocation || null,
      tiempo_solo: formData.aloneTime || null,
      tiempo_solo_futuro: formData.aloneTimeFuture || null,
      frecuencia_paseos: formData.walkFrequency || null,
      paseo_manana: formData.morningWalkTime || null,
      paseo_noche: formData.eveningWalkTime || null,
      areas_paseo: formData.walkAreas || null,
      accesorios_paseo: formData.walkAccessories || null,
      suelto_paseo: formData.offLeash || null,
      donde_suelto: formData.offLeashWhere || null,
      ubicacion_perro: formData.dogLocation || null,
      habitaciones_prohibidas: formData.forbiddenRooms || null,
      lugar_dormir: formData.sleepLocation || null,
      politica_sofa: formData.sofaPolicy || null,
      politica_travesuras: formData.misbehaviorPolicy || null,

      // Paso 7: Salud y Vacaciones
      mala_experiencia_perro: formData.badExperienceWithDog || null,
      plan_vacaciones: formData.vacationPlan || null,
      cambios_familiares: formData.familyChangePolicy || null,
      veterinario_nombre: formData.veterinarianName || null,
      veterinario_telefono: formData.veterinarianPhone || null,
      acuerdo_esterilizacion: formData.sterileAgreement || null,
      tipo_perro_preferencia: formData.dogTypePreference || null,
      razon_tipo_perro: formData.dogTypeReason || null,
      tolera_problema_fisico: formData.physicalProblemTolerance || null,
      preferencia_cachorro: formData.puppyPreference || null,
      por_que_cachorro: formData.puppyWhy || null,
      cuidados_cachorro: formData.puppyCare || null,
      ventajas_cachorro: formData.puppyAdvantages || null,
      desventajas_cachorro: formData.puppyDisadvantages || null,
      aspecto_negativo: formData.negativeDogAspect || null,

      // Paso 8: Conducta y Compromisos
      problemas_comportamiento: formData.behaviorProblems || null,
      causa_problemas: formData.behaviorCauses || null,
      problemas_solubles: formData.behaviorSolvable || null,
      solucion_problemas: formData.behaviorSolution || null,
      libros_comportamiento: formData.behaviorBooks || null,
      metodos_entrenamiento: formData.trainingMethods || null,
      metodo_ensuciamiento: formData.housetrainingMethod || null,
      experiencia_perro_miedoso: formData.fearfulDogExperience || null,
      consentimiento_visita: formData.homeVisitConsent || null,
      inconveniente_cirugia: formData.postSurgeryInconvenience || null,
      descripcion_inconveniente: formData.postSurgeryDescription || null,
      acuerdo_cuota_adopcion: formData.adoptionFeeConsent || null,
      consciente_problemas_conducta: formData.behaviorProblemsAware || null,
      dispuesto_trabajar_conducta: formData.willingToConductWork || null,
      dispuesto_seguir_consejos: formData.willingToFollowAdvice || null,
      consciente_miedos: formData.fearsAware || null,
      dispuesto_ayudar_miedos: formData.willingToHelpFears || null,
      dispuesto_seguir_consejos_miedos: formData.willingToFollowFearsAdvice || null,
      comentarios_adicionales: formData.additionalComments || null,
      como_conociste: formData.howDidYouKnowUs || null,
      feedback_formulario: formData.formFeedback || null,

      // Campos de sistema
      info_adicional: formData.additionalInfo || null,
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