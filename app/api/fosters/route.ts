import { NextRequest, NextResponse } from 'next/server';
import { fosterSchema, FosterFormData } from '@/lib/validations/foster';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Llamadas a la API de Payload usando credenciales de Authorization
 */
async function callPayloadAPI(path: string, method: string = 'GET', body?: any) {
  const baseURL = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000';
  const apiKey = process.env.PAYLOAD_API_KEY;

  const options: RequestInit = {
    method,
    headers: {
      Authorization: `users API-Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
  };

  if (body && (method === 'POST' || method === 'PATCH')) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${baseURL}/api${path}`, options);
  if (!response.ok) {
    throw new Error(`Payload API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Enviar email de notificación
 */
async function sendNotificationEmail(formData: FosterFormData, isFoster: boolean = true) {
  const emailSubject = isFoster ? 'Nueva solicitud de acogida' : 'Nueva solicitud de adopción';
  const emailTemplate = `
    <h1>${emailSubject}</h1>
    <p><strong>Nombre:</strong> ${formData.firstName} ${formData.lastName}</p>
    <p><strong>Email:</strong> ${formData.email}</p>
    <p><strong>Teléfono:</strong> ${formData.phone}</p>
    <p><strong>Domicilio:</strong> ${formData.street}, ${formData.postalCode} ${formData.city} (${formData.province})</p>
    <p><strong>Tipo de vivienda:</strong> ${formData.housingType}</p>
    <p><strong>Razón:</strong> ${formData.adoptionReason}</p>
  `;

  // Notificación interna a Somos Galgos
  if (process.env.FOSTER_NOTIFICATION_EMAIL) {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@somosgalgos.es',
      to: process.env.FOSTER_NOTIFICATION_EMAIL,
      subject: emailSubject,
      html: emailTemplate,
    });
  }

  // Confirmación al usuario
  if (formData.email) {
    const userConfirmation = `
      <h1>Solicitud de ${isFoster ? 'acogida' : 'adopción'} recibida</h1>
      <p>Hola ${formData.firstName},</p>
      <p>Hemos recibido tu solicitud de ${isFoster ? 'acogida' : 'adopción'}. Nos pondremos en contacto contigo pronto.</p>
      <p>Gracias por tu interés en Somos Galgos.</p>
    `;

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@somosgalgos.es',
      to: formData.email,
      subject: `Confirmación de solicitud de ${isFoster ? 'acogida' : 'adopción'}`,
      html: userConfirmation,
    });
  }
}

/**
 * POST /api/fosters
 * Procesar solicitud de acogida
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('Body recibido:', {
      email: body.email,
      nombre: body.firstName,
      dogId: body.dogId,
    });

    // Validar con schema de acogida
    const parsed = fosterSchema.safeParse(body);
    if (!parsed.success) {
      console.error('Validación fallida:', parsed.error.flatten().fieldErrors);
      return NextResponse.json(
        {
          error: 'Validación fallida',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const formData = parsed.data;

    console.log(`Procesando solicitud de acogida:`, {
      email: formData.email,
      nombre: formData.firstName,
      dogId: formData.dogId,
    });

    // Preparar datos para guardar en Payload
    const payloadData = {
      // Datos del Perro (requeridos)
      situacion: 'foster',
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
      trabaja_actualmente: formData.currentlyWorking || null,
      estabilidad_trabajo: formData.workStability || null,
      horario_trabajo: formData.workSchedule || null,
      hobbies: formData.hobbies || null,

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
      fecha_limite_acogida: (formData as any).fosterEndDate || null,
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
    await sendNotificationEmail(formData, true);
    console.log('Emails enviados correctamente');

    return NextResponse.json(
      {
        success: true,
        message: 'Solicitud de acogida guardada y emails enviados correctamente',
        recordId: payloadResponse.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error en POST /api/fosters:', error);

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
 * GET /api/fosters?email=...
 * Obtener solicitudes de acogida por email
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

    console.log('Buscando solicitudes de acogida para:', email);

    const response = await callPayloadAPI(
      `/foster_adoptions?where[email][equals]=${encodeURIComponent(email)}&where[situacion][equals]=foster`,
      'GET'
    );

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error en GET /api/fosters:', error);

    return NextResponse.json(
      {
        error: 'Error al obtener solicitudes',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
