import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    useAPIKey: true,
  },
  fields: [
    {
      name: 'role',
      label: 'Rol',
      type: 'select',
      required: true,
      defaultValue: 'user',
      options: [
        { label: 'Administrador', value: 'admin' },
        { label: 'Usuario', value: 'user' },
        { label: 'Voluntario', value: 'voluntario' },
      ],
    },
    // ...otros campos
  ],
}
