import type { CollectionConfig } from 'payload';
import { volunteerReadOnlyCollectionAccess } from '../lib/access/volunteerReadOnly';

// Control de acceso específico para FosterAdoptions:
// - Cualquier usuario autenticado (incluyendo API key) puede crear
// - Voluntarios solo pueden leer, no actualizar ni eliminar
// - Otros usuarios pueden hacer todo
const fosterAdoptionsAccess = {
  read: async ({ req }: any) => {
  
    const user = req.user as any;
    if (!user) return false;
    return true; // Todos los autenticados pueden leer
  },
  create: async ({ req }: any) => {
    const user = req.user as any;
    console.log("Create access check for FosterAdoptions");
    console.log("User:", user);
    // Cualquier usuario autenticado (incluyendo API key) puede crear
    if (!user) return false;
    return true; 
  },
  update: async ({ req }: any) => {
    const user = req.user as any;

    if (!user) return false;
    // Voluntarios no pueden actualizar
    if ((user as any).role === 'voluntario') return false;
    return true;
  },
  delete: async ({ req }: any) => {
    const user = req.user as any;
    if (!user) return false;
    // Voluntarios no pueden eliminar
    if ((user as any).role === 'voluntario') return false;
    return true;
  },
};

export const FosterAdoptions: CollectionConfig = {
  slug: "foster_adoptions",
  labels: {
    singular: "Acogida/Adopción",
    plural: "Acogidas/Adopciones",
  },
  admin: {
    useAsTitle: "nombre_contacto",
    group: "Gestión",
  },
  timestamps: true,
  access: fosterAdoptionsAccess,
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Datos del perro",
          fields: [
            {
              name: "perro",
              label: "Perro",
              type: "relationship",
              relationTo: "dogs",
              required: false,
            },
            {
              name: "situacion",
              label: "Situación",
              type: "select",
              required: true,
              options: [
                { label: "Acogida", value: "foster" },
                { label: "Adopción", value: "adoption" },
              ],
            },
            {
              name: "fecha_inicio",
              label: "Fecha de inicio",
              type: "date",
              required: true,
            },
          ],
        },
        {
          label: "Datos del solicitante",
          fields: [
            // Paso 1: Datos Personales
            {
              name: "nombre_contacto",
              label: "Nombre de contacto",
              type: "text",
              maxLength: 200,
            },
            {
              name: "documento_identidad",
              label: "DNI/NIE",
              type: "text",
              maxLength: 30,
            },
            {
              name: "email",
              label: "Correo electrónico",
              type: "email",
            },
            {
              name: "telefono_contacto",
              label: "Teléfono de contacto",
              type: "text",
              maxLength: 20,
            },
            {
              name: "otras_formas_contacto",
              label: "Otras formas de contacto",
              type: "text",
              maxLength: 200,
            },
            {
              name: "año_nacimiento",
              label: "Año de nacimiento",
              type: "number",
              min: 1900,
              max: 2100,
            },
            {
              name: "estado_civil",
              label: "Estado civil",
              type: "select",
              options: [
                { label: "Soltero/a", value: "single" },
                { label: "Casado/a", value: "married" },
                { label: "Divorciado/a", value: "divorced" },
                { label: "Viudo/a", value: "widowed" },
                { label: "Pareja de hecho", value: "partner" },
              ],
            },
            {
              name: "profesion",
              label: "Profesión",
              type: "text",
              maxLength: 100,
            },
            {
              name: "trabaja_actualmente",
              label: "¿Trabaja actualmente?",
              type: "select",
              options: [
                { label: "Sí", value: "yes" },
                { label: "No", value: "no" },
              ],
            },
            {
              name: "estabilidad_trabajo",
              label: "¿Tiene estabilidad en su trabajo?",
              type: "select",
              options: [
                { label: "Sí", value: "yes" },
                { label: "No", value: "no" },
              ],
            },
            {
              name: "horario_trabajo",
              label: "¿Cuál es tu horario?",
              type: "text",
              maxLength: 200,
            },
            {
              name: "hobbies",
              label: "Háblanos de tus hobbies",
              type: "textarea",
            },
            // Paso 2: Domicilio
            {
              name: "calle",
              label: "Calle",
              type: "text",
              maxLength: 200,
            },
            {
              name: "codigo_postal",
              label: "Código postal",
              type: "text",
              maxLength: 20,
            },
            {
              name: "ciudad",
              label: "Ciudad",
              type: "text",
              maxLength: 100,
            },
            {
              name: "provincia",
              label: "Provincia",
              type: "text",
              maxLength: 100,
            },
            // Paso 3: Vivienda
            {
              name: "tipo_vivienda",
              label: "Tipo de vivienda",
              type: "select",
              options: [
                { label: "Apartamento", value: "apartment" },
                { label: "Casa", value: "house" },
                { label: "Casa adosada", value: "townhouse" },
                { label: "Granja/Terreno", value: "farm" },
                { label: "Otro", value: "other" },
              ],
            },
            {
              name: "metros_vivienda",
              label: "¿Cuántos m² tiene la vivienda?",
              type: "text",
              maxLength: 50,
            },
            {
              name: "tiene_jardin",
              label: "¿Tiene jardín o patio?",
              type: "select",
              options: [
                { label: "Sí", value: "yes" },
                { label: "No", value: "no" },
              ],
            },
            {
              name: "jardin_vallado",
              label: "¿Está vallado?",
              type: "select",
              options: [
                { label: "Sí", value: "yes" },
                { label: "No", value: "no" },
              ],
            },
            {
              name: "altura_valla",
              label: "¿Qué altura tiene la valla o muro?",
              type: "text",
              maxLength: 100,
            },
            {
              name: "vivienda_propia",
              label: "¿Es una vivienda propia o en alquiler?",
              type: "select",
              options: [
                { label: "Propia", value: "owned" },
                { label: "En alquiler", value: "rented" },
              ],
            },
            {
              name: "permiso_arrendador",
              label: "¿Tienes permiso del arrendador para tener animales?",
              type: "select",
              options: [
                { label: "Sí", value: "yes" },
                { label: "No", value: "no" },
              ],
            },
            {
              name: "limite_animales_contrato",
              label: "¿Hay algún límite en el número de animales según el contrato?",
              type: "select",
              options: [
                { label: "Sí", value: "yes" },
                { label: "No", value: "no" },
              ],
            },
            {
              name: "vecinos_contra",
              label: "¿Hay algún vecino en contra de que habiten perros en viviendas cercanas?",
              type: "select",
              options: [
                { label: "Sí", value: "yes" },
                { label: "No", value: "no" },
              ],
            },
            // Paso 4: Familia
            {
              name: "habitantes_casa",
              label: "¿Qué otras personas habitan en casa?",
              type: "textarea",
            },
            {
              name: "numero_hijos",
              label: "¿Número de hijos?",
              type: "text",
              maxLength: 50,
            },
            {
              name: "edades_hijos",
              label: "¿Edades de los hijos?",
              type: "text",
              maxLength: 200,
            },
            {
              name: "familia_acuerda",
              label: "¿Estáis todos de acuerdo en adoptar un perro?",
              type: "select",
              options: [
                { label: "Sí", value: "yes" },
                { label: "No", value: "no" },
              ],
            },
            {
              name: "alergias_familia",
              label: "¿Hay alguna persona con alergias en tu familia?",
              type: "select",
              options: [
                { label: "Sí", value: "yes" },
                { label: "No", value: "no" },
              ],
            },
            {
              name: "descripcion_alergias",
              label: "Describe las alergias",
              type: "textarea",
            },
            // Paso 5: Motivación y Experiencia
            {
              name: "razon_adopcion",
              label: "¿Por qué te has decidido a adoptar un animal?",
              type: "textarea",
            },
            {
              name: "proposito_adopcion",
              label: "¿Con qué finalidad?",
              type: "textarea",
            },
            {
              name: "quien_decide",
              label: "¿Quién ha tomado la decisión de adoptar a un animal?",
              type: "textarea",
            },
            {
              name: "dispuesto_buscar",
              label: "¿Estarías dispuesto a ir a buscar a tu futuro perro a su lugar de acogida?",
              type: "select",
              options: [
                { label: "Sí", value: "yes" },
                { label: "No", value: "no" },
              ],
            },
            {
              name: "cuando_recibir",
              label: "¿Cuándo podrías recibir al animal?",
              type: "text",
              maxLength: 200,
            },
            {
              name: "fecha_limite_acogida",
              label: "¿Hasta cuándo podrías tener al galgo? (Solo para acogidas)",
              type: "text",
              maxLength: 200,
            },
            {
              name: "necesidades_perro",
              label: "¿Qué necesidades crees que puede tener un perro adoptado?",
              type: "textarea",
            },
            {
              name: "contacto_otra_asociacion",
              label: "¿Has contactado con alguna otra asociación recientemente?",
              type: "textarea",
            },
            {
              name: "ha_adoptado_antes",
              label: "¿Has adoptado anteriormente a algún perro o animal?",
              type: "select",
              options: [
                { label: "Sí", value: "yes" },
                { label: "No", value: "no" },
              ],
            },
            {
              name: "experiencia_previa",
              label: "Describe tu experiencia previa",
              type: "textarea",
            },
            {
              name: "animales_actuales",
              label: "¿Tienes actualmente otros animales en casa?",
              type: "textarea",
            },
            // Paso 6: Cuidados y Paseos
            {
              name: "alimentacion_adecuada",
              label: "¿Qué alimentación crees que es la adecuada para él?",
              type: "textarea",
            },
            {
              name: "gastos_perro",
              label: "¿Qué gastos crees que acarrea un perro?",
              type: "textarea",
            },
            {
              name: "gastos_medicos",
              label: "¿Cómo afrontarías gastos médicos o cirugías importantes?",
              type: "textarea",
            },
            {
              name: "ubicacion_solo",
              label: "¿Dónde se quedará el perro cuando no haya nadie en casa?",
              type: "textarea",
            },
            {
              name: "tiempo_solo",
              label: "¿Cuánto tiempo pasaría el animal solo en casa?",
              type: "text",
              maxLength: 200,
            },
            {
              name: "tiempo_solo_futuro",
              label: "¿Cuántas horas pasará el animal solo cuando vuelvas al trabajo?",
              type: "text",
              maxLength: 200,
            },
            {
              name: "frecuencia_paseos",
              label: "¿Cuánto tiempo y cuántas veces al día llevarás de paseo al animal?",
              type: "text",
              maxLength: 200,
            },
            {
              name: "paseo_manana",
              label: "¿Cuándo será la primera salida del perro por la mañana?",
              type: "text",
              maxLength: 100,
            },
            {
              name: "paseo_noche",
              label: "¿Cuándo será la última del día?",
              type: "text",
              maxLength: 100,
            },
            {
              name: "areas_paseo",
              label: "¿Por dónde paseará al perro?",
              type: "textarea",
            },
            {
              name: "accesorios_paseo",
              label: "¿Qué elementos/accesorios tienes previsto emplear?",
              type: "textarea",
            },
            {
              name: "suelto_paseo",
              label: "¿Tienes previsto dejarle suelto cuando lo saques de casa?",
              type: "select",
              options: [
                { label: "Sí", value: "yes" },
                { label: "No", value: "no" },
              ],
            },
            {
              name: "donde_suelto",
              label: "¿Cuándo y dónde será?",
              type: "textarea",
            },
            {
              name: "ubicacion_perro",
              label: "¿Qué lugar de la vivienda estaría destinada al perro?",
              type: "textarea",
            },
            {
              name: "habitaciones_prohibidas",
              label: "¿Habrá alguna habitación donde tenga prohibido entrar el animal?",
              type: "textarea",
            },
            {
              name: "lugar_dormir",
              label: "¿Dónde dormirá el animal?",
              type: "textarea",
            },
            {
              name: "politica_sofa",
              label: "¿Qué harás si el perro se sube en el sofá?",
              type: "textarea",
            },
            {
              name: "politica_travesuras",
              label: "¿Y si hace alguna trastada como romper zapatos o algún mueble?",
              type: "textarea",
            },
            // Paso 7: Salud y Vacaciones
            {
              name: "mala_experiencia_perro",
              label: "¿Has tenido alguna mala experiencia con un perro?",
              type: "textarea",
            },
            {
              name: "plan_vacaciones",
              label: "¿Qué harás con el perro cuando os vayáis de vacaciones?",
              type: "textarea",
            },
            {
              name: "cambios_familiares",
              label: "¿Qué ocurrirá con el animal si se da un cambio importante en la situación familiar?",
              type: "textarea",
            },
            {
              name: "veterinario_nombre",
              label: "¿Podrías darnos el nombre de tu veterinario de referencia?",
              type: "text",
              maxLength: 200,
            },
            {
              name: "veterinario_telefono",
              label: "Teléfono del veterinario",
              type: "text",
              maxLength: 20,
            },
            {
              name: "acuerdo_esterilizacion",
              label: "¿Estás de acuerdo con la esterilización de los animales domésticos?",
              type: "select",
              options: [
                { label: "Sí", value: "yes" },
                { label: "No", value: "no" },
              ],
            },
            {
              name: "tipo_perro_preferencia",
              label: "¿Qué tipo de perro adoptarías?",
              type: "textarea",
            },
            {
              name: "razon_tipo_perro",
              label: "¿Por qué motivo adoptarías un perro con esas características?",
              type: "textarea",
            },
            {
              name: "tolera_problema_fisico",
              label: "¿Te importaría que el perro tuviera algún tipo de problema físico?",
              type: "select",
              options: [
                { label: "Sí", value: "yes" },
                { label: "No", value: "no" },
              ],
            },
            {
              name: "preferencia_cachorro",
              label: "¿Preferirías adoptar un cachorro?",
              type: "select",
              options: [
                { label: "Sí", value: "yes" },
                { label: "No", value: "no" },
              ],
            },
            {
              name: "por_que_cachorro",
              label: "¿Por qué adoptarías un cachorro?",
              type: "textarea",
            },
            {
              name: "cuidados_cachorro",
              label: "¿Qué cuidados crees que necesita un cachorro?",
              type: "textarea",
            },
            {
              name: "ventajas_cachorro",
              label: "Menciona alguna de las ventajas que creas que puede tener acoger a un cachorro",
              type: "textarea",
            },
            {
              name: "desventajas_cachorro",
              label: "¿Y los inconvenientes?",
              type: "textarea",
            },
            {
              name: "aspecto_negativo",
              label: "¿Qué aspecto negativo de los perros te molesta más?",
              type: "textarea",
            },
            // Paso 8: Conducta y Compromisos
            {
              name: "problemas_comportamiento",
              label: "Menciona todos los problemas de comportamiento que conoces",
              type: "textarea",
            },
            {
              name: "causa_problemas",
              label: "¿A qué crees que se deben estos problemas?",
              type: "textarea",
            },
            {
              name: "problemas_solubles",
              label: "¿Crees que estos problemas tienen solución?",
              type: "textarea",
            },
            {
              name: "solucion_problemas",
              label: "Ante un problema de comportamiento del perro ¿Qué harías?",
              type: "textarea",
            },
            {
              name: "libros_comportamiento",
              label: "¿Has leído alguna vez algún libro o texto sobre comportamiento del perro?",
              type: "textarea",
            },
            {
              name: "metodos_entrenamiento",
              label: "¿De qué formas tratarías de educar a un perro adoptado?",
              type: "textarea",
            },
            {
              name: "metodo_ensuciamiento",
              label: "¿Cómo crees que se enseña a un perro a hacer sus necesidades fuera del hogar?",
              type: "textarea",
            },
            {
              name: "experiencia_perro_miedoso",
              label: "¿Tienes alguna experiencia con perros miedosos o con problemas de conducta?",
              type: "textarea",
            },
            {
              name: "consentimiento_visita",
              label: "¿Estás dispuesto a recibir una visita nuestra a conocerte?",
              type: "select",
              options: [
                { label: "Sí", value: "yes" },
                { label: "No", value: "no" },
              ],
            },
            {
              name: "inconveniente_cirugia",
              label: "¿Te supondría algún inconveniente que el perro pase el postoperatorio en tu hogar?",
              type: "select",
              options: [
                { label: "Sí", value: "yes" },
                { label: "No", value: "no" },
              ],
            },
            {
              name: "descripcion_inconveniente",
              label: "Describe qué inconvenientes podría haber",
              type: "textarea",
            },
            {
              name: "acuerdo_cuota_adopcion",
              label: "¿Estás conforme con la cuota de adopción de 225€?",
              type: "select",
              options: [
                { label: "Sí", value: "yes" },
                { label: "No", value: "no" },
              ],
            },
            {
              name: "consciente_problemas_conducta",
              label: "¿Eres consciente de que los galgos pueden presentar problemas de conducta?",
              type: "select",
              options: [
                { label: "Sí", value: "yes" },
                { label: "No", value: "no" },
              ],
            },
            {
              name: "dispuesto_trabajar_conducta",
              label: "¿Estás dispuesto/a a trabajar para la mejora de la conducta del animal?",
              type: "select",
              options: [
                { label: "Sí", value: "yes" },
                { label: "No", value: "no" },
              ],
            },
            {
              name: "dispuesto_seguir_consejos",
              label: "¿Estás dispuesto/a a seguir las pautas y consejos de Somos Galgos?",
              type: "select",
              options: [
                { label: "Sí", value: "yes" },
                { label: "No", value: "no" },
              ],
            },
            {
              name: "consciente_miedos",
              label: "¿Eres consciente de que los galgos pueden presentar diferentes tipos de miedos?",
              type: "select",
              options: [
                { label: "Sí", value: "yes" },
                { label: "No", value: "no" },
              ],
            },
            {
              name: "dispuesto_ayudar_miedos",
              label: "¿Estás dispuesto/a a trabajar para ayudar al animal a superar esos miedos?",
              type: "select",
              options: [
                { label: "Sí", value: "yes" },
                { label: "No", value: "no" },
              ],
            },
            {
              name: "dispuesto_seguir_consejos_miedos",
              label: "¿Estás dispuesto/a a seguir las pautas y consejos de Somos Galgos para los miedos?",
              type: "select",
              options: [
                { label: "Sí", value: "yes" },
                { label: "No", value: "no" },
              ],
            },
            {
              name: "comentarios_adicionales",
              label: "¿Hay algo que te gustaría contarnos o que crees que deberíamos tener en cuenta?",
              type: "textarea",
            },
            {
              name: "como_conociste",
              label: "¿Cómo nos has conocido?",
              type: "text",
              maxLength: 200,
            },
            {
              name: "feedback_formulario",
              label: "¿Qué te ha parecido este cuestionario? ¿Algún comentario o sugerencia?",
              type: "textarea",
            },
            {
              name: "url_contrato_pre_adopcion",
              label: "URL contrato pre-adopción",
              type: "text",
            },
            {
              name: "url_contrato_final",
              label: "URL contrato final",
              type: "text",
            },
            {
              name: "info_adicional",
              label: "Información adicional",
              type: "textarea",
            },
          ],
        },
        {
          label: "Estado y voluntario",
          fields: [
            {
              name: "estado_riac",
              label: "Estado RIAC",
              type: "text",
              maxLength: 100,
            },
            {
              name: "observaciones",
              label: "Observaciones",
              type: "textarea",
            },
            {
              name: "voluntario_asignado",
              label: "Voluntario asignado",
              type: "relationship",
              relationTo: "volunteers",
              required: false,
            },
          ],
        },
      ],
    },
  ],
} as CollectionConfig;
