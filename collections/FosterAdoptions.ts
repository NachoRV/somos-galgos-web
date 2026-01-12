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
            {
              name: "nombre_contacto",
              label: "Nombre de contacto",
              type: "text",
              required: true,
              maxLength: 200,
            },
            {
              name: "documento_identidad",
              label: "DNI/NIE",
              type: "text",
              required: true,
              maxLength: 30,
            },
            {
              name: "calle",
              label: "Calle",
              type: "text",
              required: true,
              maxLength: 200,
            },
            {
              name: "ciudad",
              label: "Ciudad",
              type: "text",
              required: true,
              maxLength: 100,
            },
            {
              name: "codigo_postal",
              label: "Código postal",
              type: "text",
              required: true,
              maxLength: 20,
            },
            {
              name: "provincia",
              label: "Provincia",
              type: "text",
              required: true,
              maxLength: 100,
            },
            {
              name: "año_nacimiento",
              label: "Año de nacimiento",
              type: "number",
              required: true,
              min: 1900,
              max: 2100,
            },
            {
              name: "estado_civil",
              label: "Estado civil",
              type: "text",
              required: true,
              maxLength: 50,
            },
            {
              name: "profesion",
              label: "Profesión",
              type: "text",
              required: true,
              maxLength: 100,
            },
            {
              name: "telefono_contacto",
              label: "Teléfono de contacto",
              type: "text",
              required: true,
              maxLength: 20,
            },
            {
              name: "email",
              label: "Correo electrónico",
              type: "email",
              required: true,
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
              required: false,
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
              name: "creado_por",
              label: "Voluntario asignado",
              type: "relationship",
              relationTo: "users",
            },
          ],
        },
      ],
    },
  ],
} as CollectionConfig;
