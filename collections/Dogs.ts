import type { CollectionConfig } from 'payload'
import { volunteerReadOnlyCollectionAccess } from '../lib/access/volunteerReadOnly';

export const Dogs: CollectionConfig = {
  slug: "dogs",
  labels: {
    singular: "Perro",
    plural: "Perros",
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "breed", "status", "entryDate", "updatedAt"],
    group: "Gestión",
  },
  timestamps: true,
  access: volunteerReadOnlyCollectionAccess,
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Información Básica",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "name",
                  type: "text",
                  required: true,
                  minLength: 1,
                  maxLength: 100,
                  admin: { width: "50%" },
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
                    width: "25%",
                  },
                },
                {
                  name: "breed",
                  type: "text",
                  maxLength: 100,
                  admin: {
                    width: "25%",
                  },
                },
              ],
            },
            {
              type: "row",
              fields: [
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
                  name: "birthDate",
                  type: "date",
                  label: "Birth Date",
                  admin: {
                    width: "50%",
                  },
                },
              ],
            },
            {
              name: "origin",
              type: "textarea",
              maxLength: 5000,
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
          ],
        },
        {
          label: "Salud",
          fields: [
            {
              name: "neuteringDate",
              type: "date",
              label: "Fecha de esterilización",
              admin: {
                width: "50%",
              },
            },
            {
              name: "vaccines",
              type: "array",
              label: "Vacunas",
              fields: [
                {
                  name: "name",
                  type: "text",
                  label: "Nombre de la vacuna",
                  required: true,
                },
                {
                  name: "date",
                  type: "date",
                  label: "Fecha",
                  required: true,
                },
                {
                  name: "veterinarian",
                  type: "text",
                  label: "Veterinario/a",
                },
                {
                  name: "notes",
                  type: "textarea",
                  label: "Notas",
                  maxLength: 1000,
                },
              ],
            },
            {
              name: "deworming",
              type: "array",
              label: "Desparasitaciones",
              fields: [
                {
                  name: "date",
                  type: "date",
                  label: "Fecha",
                  required: true,
                },
                {
                  name: "product",
                  type: "text",
                  label: "Producto",
                },
                {
                  name: "veterinarian",
                  type: "text",
                  label: "Veterinario/a",
                },
                {
                  name: "notes",
                  type: "textarea",
                  label: "Notas",
                  maxLength: 1000,
                },
              ],
            },
            {
              name: "vetHistoryUrl",
              type: "array",
              label: "Historial veterinario (URLs)",
              fields: [
                {
                  name: "url",
                  type: "text",
                  label: "URL",
                  required: true,
                },
                {
                  name: "description",
                  type: "text",
                  label: "Descripción",
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
              type: "richText",
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
        {
          label: "Información para la web",
          fields: [
            {
              name: "isInvisible",
              type: "checkbox",
              label: "Is Invisible",
              defaultValue: false,
            },
            {
              name: "testedWithCats",
              type: "checkbox",
              label: "Tested With Cats",
            },
            {
              name: "webDescription",
              type: "richText",
              label: "Web Description",
            },
          ],
        },
      ],
    },
  ],
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