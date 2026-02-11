import type { GlobalConfig } from 'payload'

export const ImpactStats: GlobalConfig = {
  slug: 'impact-stats',
  label: 'Estadísticas de impacto',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'stats',
      type: 'array',
      label: 'Estadísticas de impacto',
      required: true,
      minRows: 1,
      maxRows: 8,
      fields: [
        {
          name: 'key',
          type: 'text',
          required: true,
          label: 'Clave de traducción',
          admin: {
            description: 'Clave usada en las traducciones i18n. Claves válidas: rescued, adopted, sponsored, volunteers (debe coincidir con messages/[locale].json bajo Home.Impact)',
          },
        },
        {
          name: 'icon_type',
          type: 'select',
          required: true,
          label: 'Icono',
          options: [
            { label: '❤️ Corazón', value: 'heart' },
            { label: '🏠 Hogar', value: 'home' },
            { label: '💰 Dinero', value: 'dollar-sign' },
            { label: '👥 Personas', value: 'users' },
          ],
          defaultValue: 'heart',
        },
        {
          name: 'target',
          type: 'number',
          required: true,
          label: 'Número objetivo',
          admin: {
            description: 'Número que se mostrará (p. ej., 250). El contador animará de 0 a este valor.',
          },
          min: 0,
        },
        {
          name: 'color',
          type: 'select',
          required: true,
          label: 'Color del icono',
          options: [
            { label: '🔴 Rojo', value: 'red' },
            { label: '🔵 Azul', value: 'blue' },
            { label: '🟢 Verde', value: 'green' },
            { label: '🟡 Amarillo', value: 'yellow' },
            { label: '🟣 Morado', value: 'purple' },
            { label: '🟠 Naranja', value: 'orange' },
            { label: '🎨 Primario', value: 'primary' },
            { label: '🎨 Secundario', value: 'secondary' },
            { label: '🎨 Acento', value: 'accent' },
          ],
          defaultValue: 'primary',
        },
        {
          name: 'order',
          type: 'number',
          label: 'Orden de visualización',
          admin: {
            description: 'Orden de aparición (los números más bajos aparecen primero). Controla la secuencia de las estadísticas mostradas.',
          },
          defaultValue: 0,
        },
      ],
      admin: {
        description: 'Configura las estadísticas de impacto que se muestran en la página principal y en la página "Sobre Nosotros".',
      },
    },
  ],
}
