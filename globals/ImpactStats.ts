import type { GlobalConfig } from 'payload'

export const ImpactStats: GlobalConfig = {
  slug: 'impact-stats',
  label: 'Impact Statistics',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'stats',
      type: 'array',
      label: 'Impact Statistics',
      required: true,
      minRows: 1,
      maxRows: 8,
      fields: [
        {
          name: 'key',
          type: 'text',
          required: true,
          label: 'Translation Key',
          admin: {
            description: 'Key used in i18n translations. Valid keys: rescued, adopted, sponsored, volunteers (must match keys in messages/[locale].json under Home.Impact)',
          },
        },
        {
          name: 'icon_type',
          type: 'select',
          required: true,
          label: 'Icon',
          options: [
            { label: '❤️ Heart', value: 'heart' },
            { label: '🏠 Home', value: 'home' },
            { label: '💰 Dollar Sign', value: 'dollar-sign' },
            { label: '👥 Users', value: 'users' },
          ],
          defaultValue: 'heart',
        },
        {
          name: 'target',
          type: 'number',
          required: true,
          label: 'Target Number',
          admin: {
            description: 'The number that will be displayed (e.g., 250). The counter will animate from 0 to this value.',
          },
          min: 0,
        },
        {
          name: 'color',
          type: 'select',
          required: true,
          label: 'Icon Color',
          options: [
            { label: '🔴 Red', value: 'red' },
            { label: '🔵 Blue', value: 'blue' },
            { label: '🟢 Green', value: 'green' },
            { label: '🟡 Yellow', value: 'yellow' },
            { label: '🟣 Purple', value: 'purple' },
            { label: '🟠 Orange', value: 'orange' },
            { label: '🎨 Primary', value: 'primary' },
            { label: '🎨 Secondary', value: 'secondary' },
            { label: '🎨 Accent', value: 'accent' },
          ],
          defaultValue: 'primary',
        },
        {
          name: 'order',
          type: 'number',
          label: 'Display Order',
          admin: {
            description: 'Order of appearance (lower numbers appear first). Used to control the sequence of stats displayed.',
          },
          defaultValue: 0,
        },
      ],
      admin: {
        description: 'Configure the impact statistics displayed on the website homepage and about page.',
      },
    },
  ],
}
