import type { CollectionConfig } from 'payload';

// Control de acceso para Volunteers:
// - Cualquiera puede crear (formulario público de voluntariado)
// - Solo lectura para usuarios registrados
// - Admins pueden crear, actualizar y eliminar
const volunteersAccess = {
  read: async ({ req }: any) => {
    // Los admins pueden leer, otros solo si están autenticados
    const user = req.user as any;
    if (!user) return false;
    return true;
  },
  create: async ({ req }: any) => {
    // Permitir crear sin autenticación (formulario público)
    return true;
  },
  update: async ({ req }: any) => {
    const user = req.user as any;
    if (!user) return false;
    if (user.role === 'voluntario') return false;
    return true;
  },
  delete: async ({ req }: any) => {
    const user = req.user as any;
    if (!user) return false;
    if (user.role === 'voluntario') return false;
    return true;
  },
};

export const Volunteers: CollectionConfig = {
  slug: 'volunteers',
  labels: {
    singular: 'Voluntario',
    plural: 'Voluntarios',
  },
  admin: {
    useAsTitle: 'full_name',
    defaultColumns: ['full_name', 'phone', 'status', 'created_at'],
    group: 'Gestión',
  },
  timestamps: true,
  access: volunteersAccess,
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Información Personal',
          fields: [
            {
              name: 'full_name',
              label: 'Nombre Completo',
              type: 'text',
              required: true,
              maxLength: 200,
            },
            {
              name: 'dni',
              label: 'DNI/NIE',
              type: 'text',
              required: true,
              maxLength: 20,
            },
            {
              name: 'birth_date',
              label: 'Fecha de Nacimiento',
              type: 'date',
              required: true,
            },
            {
              name: 'residence_location',
              label: 'Lugar de Residencia',
              type: 'text',
              required: true,
              maxLength: 200,
            },
            {
              name: 'phone',
              label: 'Teléfono de Contacto',
              type: 'text',
              required: true,
              maxLength: 20,
            },
            {
              name: 'driving_license',
              label: '¿Tienes carnet de conducir?',
              type: 'select',
              required: true,
              options: [
                {
                  label: 'Sí, tengo carnet.',
                  value: 'si_carnet',
                },
                {
                  label: 'Sí, tengo carnet y coche propio.',
                  value: 'si_carnet_coche',
                },
                {
                  label: 'No tengo carnet de conducir.',
                  value: 'no_carnet',
                },
              ],
            },
          ],
        },
        {
          label: 'Gestión',
          fields: [
            {
              name: 'status',
              label: 'Estado',
              type: 'select',
              defaultValue: 'en_revision',
              required: true,
              options: [
                {
                  label: 'En Revisión',
                  value: 'en_revision',
                },
                {
                  label: 'Activo',
                  value: 'activo',
                },
                {
                  label: 'Baja',
                  value: 'baja',
                },
              ],
              admin: {
                description: 'Estado del voluntario en el sistema',
              },
            },
            {
              name: 'availability',
              label: 'Disponibilidad (Descripción)',
              type: 'textarea',
              defaultValue: '',
              admin: {
                description: 'Describe su disponibilidad (ej: fines de semana, tardes, etc)',
              },
            },
            {
              name: 'start_date',
              label: 'Fecha de Inicio',
              type: 'date',
              admin: {
                description: 'Fecha en que comenzó el voluntariado',
              },
            },
            {
              name: 'notes',
              label: 'Notas del Administrador',
              type: 'textarea',
              defaultValue: '',
              admin: {
                description: 'Notas internas sobre el voluntario',
              },
            },
          ],
        },
        {
          label: 'Auditoría',
          fields: [
            {
              name: 'created_by',
              label: 'Creado por',
              type: 'relationship',
              relationTo: 'users',
              admin: {
                readOnly: true,
                hidden: true,
              },
            },
            {
              name: 'updated_by',
              label: 'Actualizado por',
              type: 'relationship',
              relationTo: 'users',
              admin: {
                readOnly: true,
                hidden: true,
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create') {
          data.created_by = req.user?.id;
        }
        if (operation === 'update') {
          data.updated_by = req.user?.id;
        }
        return data;
      },
    ],
  },
} as CollectionConfig;
