import type { GlobalConfig } from 'payload'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'Sobre Nosotros',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Información general',
          description: 'Contenido básico de la página',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Título de la página',
            },
            {
              name: 'subtitle',
              type: 'text',
              label: 'Subtítulo',
            },
            {
              name: 'description',
              type: 'richText',
              label: 'Descripción',
            },
          ],
        },
        {
          label: 'Misión y Visión',
          description: 'Misión, visión y valores de la organización',
          fields: [
            {
              name: 'mission',
              type: 'richText',
              label: 'Nuestra misión',
            },
            {
              name: 'vision',
              type: 'richText',
              label: 'Nuestra visión',
            },
            {
              name: 'values',
              type: 'array',
              label: 'Valores',
              fields: [
                {
                  name: 'value',
                  type: 'text',
                  required: true,
                  label: 'Nombre del valor',
                },
                {
                  name: 'description',
                  type: 'text',
                  label: 'Descripción del valor',
                },
              ],
            },
          ],
        },
        {
          label: 'Estadísticas',
          description: 'Estadísticas e impacto',
          fields: [
            {
              name: 'stats',
              type: 'array',
              label: 'Estadísticas',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  label: 'Etiqueta',
                },
                {
                  name: 'number',
                  type: 'number',
                  required: true,
                  label: 'Número',
                },
                {
                  name: 'suffix',
                  type: 'text',
                  label: 'Sufijo (p. ej. "+", "%")',
                },
              ],
            },
          ],
        },
        {
          label: 'Equipo',
          description: 'Información de los miembros del equipo',
          fields: [
            {
              name: 'team_members',
              type: 'array',
              label: 'Miembros del equipo',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Nombre',
                },
                {
                  name: 'role',
                  type: 'text',
                  required: true,
                  label: 'Cargo',
                },
                {
                  name: 'bio',
                  type: 'textarea',
                  label: 'Biografía',
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Imagen de perfil',
                },
                {
                  name: 'email',
                  type: 'email',
                  label: 'Correo electrónico',
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          description: 'Optimización para buscadores',
          fields: [
            {
              name: 'meta_title',
              type: 'text',
              label: 'Título meta',
            },
            {
              name: 'meta_description',
              type: 'textarea',
              label: 'Descripción meta',
            },
          ],
        },
      ],
    },
  ],
}
