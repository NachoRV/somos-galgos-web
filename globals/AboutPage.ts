import type { GlobalConfig } from 'payload'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About Page',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General Information',
          description: 'Basic page content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Page Title',
            },
            {
              name: 'subtitle',
              type: 'text',
              label: 'Subtitle',
            },
            {
              name: 'description',
              type: 'richText',
              label: 'Main Description',
            },
          ],
        },
        {
          label: 'Mission & Vision',
          description: 'Organization mission, vision, and values',
          fields: [
            {
              name: 'mission',
              type: 'richText',
              label: 'Our Mission',
            },
            {
              name: 'vision',
              type: 'richText',
              label: 'Our Vision',
            },
            {
              name: 'values',
              type: 'array',
              label: 'Core Values',
              fields: [
                {
                  name: 'value',
                  type: 'text',
                  required: true,
                  label: 'Value Name',
                },
                {
                  name: 'description',
                  type: 'text',
                  label: 'Value Description',
                },
              ],
            },
          ],
        },
        {
          label: 'Statistics',
          description: 'Impact statistics and numbers',
          fields: [
            {
              name: 'stats',
              type: 'array',
              label: 'Statistics',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  label: 'Stat Label',
                },
                {
                  name: 'number',
                  type: 'number',
                  required: true,
                  label: 'Stat Number',
                },
                {
                  name: 'suffix',
                  type: 'text',
                  label: 'Suffix (e.g., "+", "%")',
                },
              ],
            },
          ],
        },
        {
          label: 'Team',
          description: 'Team members information',
          fields: [
            {
              name: 'team_members',
              type: 'array',
              label: 'Team Members',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Name',
                },
                {
                  name: 'role',
                  type: 'text',
                  required: true,
                  label: 'Role',
                },
                {
                  name: 'bio',
                  type: 'textarea',
                  label: 'Biography',
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Profile Image',
                },
                {
                  name: 'email',
                  type: 'email',
                  label: 'Email',
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          description: 'Search engine optimization',
          fields: [
            {
              name: 'meta_title',
              type: 'text',
              label: 'Meta Title',
            },
            {
              name: 'meta_description',
              type: 'textarea',
              label: 'Meta Description',
            },
          ],
        },
      ],
    },
  ],
}
