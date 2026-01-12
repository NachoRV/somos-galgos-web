import type { CollectionConfig } from 'payload'

export const Dogs: CollectionConfig = {
  slug: "dogs",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "breed", "status", "entryDate", "updatedAt"],
    group: "Gestión",
  },
  timestamps: true,
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Información Básica",
          fields: [
            {
              name: "name",
              type: "text",
              required: true,
              minLength: 1,
              maxLength: 100,
            },
            {
              name: "chipNumber",
              type: "text",
              label: "Chip Number",
              unique: true,
              admin: {
                width: "50%",
              },
            },
            {
              name: "sex",
              type: "select",
              options: [
                {
                  label: "Male",
                  value: "male",
                },
                {
                  label: "Female",
                  value: "female",
                },
              ],
              admin: {
                width: "50%",
              },
            },
            {
              name: "breed",
              type: "text",
              maxLength: 100,
              admin: {
                width: "50%",
              },
            },
            {
              name: "birthDate",
              type: "date",
              label: "Birth Date",
              admin: {
                width: "50%",
              },
            },
            {
              name: "entryDate",
              type: "date",
              label: "Entry Date",
              required: true,
              admin: {
                width: "50%",
              },
            },
            {
              name: "origin",
              type: "textarea",
              maxLength: 5000,
            },
          ],
        },
        {
          label: "Estado",
          fields: [
            {
              name: "status",
              type: "select",
              required: true,
              defaultValue: "available",
              options: [
                {
                  label: "Available",
                  value: "available",
                },
                {
                  label: "In Residence",
                  value: "in_residence",
                },
                {
                  label: "Fostered",
                  value: "fostered",
                },
                {
                  label: "Adopted",
                  value: "adopted",
                },
                {
                  label: "In Treatment",
                  value: "in_treatment",
                },
                {
                  label: "Reserved",
                  value: "reserved",
                },
                {
                  label: "Lost",
                  value: "lost",
                },
                {
                  label: "Deceased",
                  value: "deceased",
                },
              ],
              admin: {
                width: "50%",
              },
            },
            {
              name: "isInvisible",
              type: "checkbox",
              label: "Is Invisible (Hidden from web)",
              defaultValue: false,
            },
            {
              name: "testedWithCats",
              type: "checkbox",
              label: "Tested With Cats",
            },
            {
              name: "webDescription",
              type: "textarea",
              label: "Web Description",
              maxLength: 10000,
            },
          ],
        },
        {
          label: "Salud",
          fields: [
            {
              name: "neuteringDate",
              type: "date",
              label: "Neutering Date",
              admin: {
                width: "50%",
              },
            },
            {
              name: "vaccines",
              type: "array",
              fields: [
                {
                  name: "name",
                  type: "text",
                  required: true,
                },
                {
                  name: "date",
                  type: "date",
                  required: true,
                },
                {
                  name: "veterinarian",
                  type: "text",
                },
                {
                  name: "notes",
                  type: "textarea",
                  maxLength: 1000,
                },
              ],
            },
            {
              name: "deworming",
              type: "array",
              fields: [
                {
                  name: "date",
                  type: "date",
                  required: true,
                },
                {
                  name: "product",
                  type: "text",
                },
                {
                  name: "veterinarian",
                  type: "text",
                },
                {
                  name: "notes",
                  type: "textarea",
                  maxLength: 1000,
                },
              ],
            },
            {
              name: "vetHistoryUrl",
              type: "array",
              label: "Veterinary History URLs",
              fields: [
                {
                  name: "url",
                  type: "text",
                  required: true,
                },
                {
                  name: "description",
                  type: "text",
                  maxLength: 500,
                },
              ],
            },
          ],
        },
        {
          label: "Multimedia",
          fields: [
            {
              name: "photos",
              type: "array",
              fields: [
                {
                  name: "image",
                  type: "upload",
                  relationTo: "media",
                  required: true,
                },
                {
                  name: "caption",
                  type: "text",
                  maxLength: 500,
                },
                {
                  name: "order",
                  type: "number",
                  defaultValue: 0,
                },
              ],
            },
          ],
        },
        {
          label: "Notas",
          fields: [
            {
              name: "notes",
              type: "textarea",
              maxLength: 5000,
            },
            {
              name: "createdBy",
              type: "relationship",
              relationTo: "users",
              label: "Created By",
              admin: {
                readOnly: true,
                hidden: true,
              },
            },
            {
              name: "updatedBy",
              type: "relationship",
              relationTo: "users",
              label: "Updated By",
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
  access: {
    read: async () => true,
    create: async ({ req }) => {
      return req.user ? true : false;
    },
    update: async ({ req }) => {
      return req.user ? true : false;
    },
    delete: async ({ req }) => {
      return req.user ? true : false;
    },
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === "create") {
          data.createdBy = req.user?.id;
        }
        if (operation === "update") {
          data.updatedBy = req.user?.id;
        }
        return data;
      },
    ],
  },
};
