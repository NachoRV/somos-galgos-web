import type { CollectionConfig } from 'payload';

// Control de acceso para Volunteers:
// - Voluntarios pueden leer (read-only)
// - Admins/usuarios pueden crear, actualizar y eliminar
const volunteersAccess = {
  read: async ({ req }: any) => {
    const user = req.user as any;
    if (!user) return false;
    return true;
  },
  create: async ({ req }: any) => {
    const user = req.user as any;
    if (!user) return false;
    if (user.role === 'voluntario') return false;
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
    useAsTitle: 'first_name',
    defaultColumns: ['first_name', 'last_name', 'phone', 'is_active', 'start_date'],
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
              type: 'row',
              fields: [
                {
                  name: 'first_name',
                  label: 'Nombre',
                  type: 'text',
                  required: true,
                  maxLength: 100,
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'last_name',
                  label: 'Apellido',
                  type: 'text',
                  required: true,
                  maxLength: 100,
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'phone',
              label: 'Teléfono',
              type: 'text',
              maxLength: 20,
            },
          ],
        },
        {
          label: 'Disponibilidad',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'start_date',
                  label: 'Fecha de Inicio',
                  type: 'date',
                  required: true,
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'end_date',
                  label: 'Fecha de Fin',
                  type: 'date',
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'availability',
              label: 'Disponibilidad (Descripción)',
              type: 'textarea',
              defaultValue: '',
              admin: {
                description: 'Describe tu disponibilidad (ej: fines de semana, tardes, etc)',
              },
            },
            {
              name: 'is_active',
              label: 'Activo',
              type: 'checkbox',
              defaultValue: true,
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
