import type { GlobalConfig } from 'payload'

export const SuccessStories: GlobalConfig = {
  slug: 'success-stories',
  label: 'Historias de éxito',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Mostrar sección de historias de éxito',
      defaultValue: true,
      admin: {
        description: 'Alternar para mostrar/ocultar la sección de historias de éxito en la página principal',
      },
    },
    {
      name: 'stories',
      type: 'array',
      label: 'Historias de éxito',
      required: true,
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'dogName',
          type: 'text',
          required: true,
          label: 'Nombre del perro',
          admin: {
            description: 'Nombre del galgo adoptado',
          },
        },
        {
          name: 'dogImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Imagen del perro',
          admin: {
            description: 'Foto del perro adoptado (preferiblemente en su nuevo hogar)',
          },
        },
        {
          name: 'ownerName',
          type: 'text',
          required: true,
          label: 'Nombre del adoptante',
          admin: {
            description: 'Nombre de la persona/familia que adoptó al perro',
          },
        },
        {
          name: 'testimonial',
          type: 'textarea',
          required: true,
          label: 'Testimonio',
          admin: {
            description: 'Testimonio del adoptante sobre su experiencia (mantener entre 200-300 caracteres para mejor presentación)',
          },
          maxLength: 500,
        },
        {
          name: 'adoptionDate',
          type: 'date',
          required: true,
          label: 'Fecha de adopción',
          admin: {
            description: 'Fecha en que se realizó la adopción del perro',
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'MMMM d, yyyy',
            },
          },
        },
        {
          name: 'featured',
          type: 'checkbox',
          label: 'Historia destacada',
          defaultValue: false,
          admin: {
            description: 'Marcar como destacada para mostrarla primero en el carrusel',
          },
        },
        {
          name: 'active',
          type: 'checkbox',
          label: 'Activo',
          defaultValue: true,
          admin: {
            description: 'Desmarcar para ocultar temporalmente esta historia sin eliminarla',
          },
        },
        {
          name: 'order',
          type: 'number',
          label: 'Orden de visualización',
          admin: {
            description: 'Orden en el que aparecen las historias (números más bajos primero). Las historias destacadas siempre aparecen primero.',
          },
          defaultValue: 0,
        },
      ],
      admin: {
        description: 'Gestiona el carrusel de historias de éxito que se muestra en la página principal',
        initCollapsed: true,
      },
    },
  ],
  admin: {
    description: 'Gestiona los testimonios e historias de éxito de los adoptantes',
  },
}
