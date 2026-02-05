import type { GlobalConfig } from 'payload'

export const SuccessStories: GlobalConfig = {
  slug: 'success-stories',
  label: 'Success Stories',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Show Success Stories Section',
      defaultValue: true,
      admin: {
        description: 'Toggle to show/hide the entire success stories section on the homepage',
      },
    },
    {
      name: 'stories',
      type: 'array',
      label: 'Success Stories',
      required: true,
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'dogName',
          type: 'text',
          required: true,
          label: 'Dog Name',
          admin: {
            description: 'Name of the adopted greyhound',
          },
        },
        {
          name: 'dogImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Dog Image',
          admin: {
            description: 'Photo of the adopted dog (preferably in their new home)',
          },
        },
        {
          name: 'ownerName',
          type: 'text',
          required: true,
          label: 'Owner Name',
          admin: {
            description: 'Name of the person/family who adopted the dog',
          },
        },
        {
          name: 'testimonial',
          type: 'textarea',
          required: true,
          label: 'Testimonial',
          admin: {
            description: 'The adopter testimonial about their experience (keep it between 200-300 characters for best display)',
          },
          maxLength: 500,
        },
        {
          name: 'adoptionDate',
          type: 'date',
          required: true,
          label: 'Adoption Date',
          admin: {
            description: 'Date when the dog was adopted',
            date: {
              pickerAppearance: 'dayOnly',
              displayFormat: 'MMMM d, yyyy',
            },
          },
        },
        {
          name: 'featured',
          type: 'checkbox',
          label: 'Featured Story',
          defaultValue: false,
          admin: {
            description: 'Mark as featured to show first in the carousel',
          },
        },
        {
          name: 'active',
          type: 'checkbox',
          label: 'Active',
          defaultValue: true,
          admin: {
            description: 'Uncheck to temporarily hide this story without deleting it',
          },
        },
        {
          name: 'order',
          type: 'number',
          label: 'Display Order',
          admin: {
            description: 'Order in which stories appear (lower numbers first). Featured stories always appear first.',
          },
          defaultValue: 0,
        },
      ],
      admin: {
        description: 'Manage the success stories carousel displayed on the homepage',
        initCollapsed: true,
      },
    },
  ],
  admin: {
    description: 'Manage testimonials and success stories from adopters',
  },
}
