import type { CollectionConfig } from 'payload';

const sponsorshipsAccess = {
  read: async ({ req }: any) => {
    const user = req.user as any;
    if (!user) return false;
    return true;
  },
  create: async ({ req }: any) => {
    const user = req.user as any;
    if (!user) return false;
    return true;
  },
  update: async ({ req }: any) => {
    const user = req.user as any;
    if (!user) return false;
    if ((user as any).role === 'voluntario') return false;
    return true;
  },
  delete: async ({ req }: any) => {
    const user = req.user as any;
    if (!user) return false;
    if ((user as any).role === 'voluntario') return false;
    return true;
  },
};

export const Sponsorships: CollectionConfig = {
  slug: "sponsorships",
  labels: {
    singular: "Apadrinamiento",
    plural: "Apadrinamientos",
  },
  admin: {
    useAsTitle: "nombre",
    group: "Gestión",
  },
  timestamps: true,
  access: sponsorshipsAccess,
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Datos del perro",
          fields: [
            {
              name: "perro",
              label: "Perro",
              type: "relationship",
              relationTo: "dogs",
              required: false,
            },
            {
              name: "nombre_perro_opcional",
              label: "Nombre del perro (opcional)",
              type: "text",
              maxLength: 100,
              required: false,
            },
            {
              name: "fecha_inicio",
              label: "Fecha de inicio",
              type: "date",
              required: true,
            },
          ],
        },
        {
          label: "Datos del padrino",
          fields: [
            {
              name: "nombre",
              label: "Nombre",
              type: "text",
              required: true,
              maxLength: 100,
            },
            {
              name: "apellido1",
              label: "Apellido 1",
              type: "text",
              required: true,
              maxLength: 100,
            },
            {
              name: "apellido2",
              label: "Apellido 2",
              type: "text",
              required: true,
              maxLength: 100,
            },
            {
              name: "documento_identidad",
              label: "DNI/NIE/NIF",
              type: "text",
              required: true,
              maxLength: 30,
            },
            {
              name: "calle",
              label: "Dirección",
              type: "text",
              required: true,
              maxLength: 200,
            },
            {
              name: "codigo_postal",
              label: "Código postal",
              type: "text",
              required: true,
              maxLength: 10,
            },
            {
              name: "ciudad",
              label: "Población",
              type: "text",
              required: true,
              maxLength: 100,
            },
            {
              name: "provincia",
              label: "Provincia",
              type: "text",
              required: true,
              maxLength: 100,
            },
            {
              name: "email",
              label: "E-mail de contacto",
              type: "email",
              required: true,
            },
            {
              name: "telefono_contacto",
              label: "Teléfono de contacto",
              type: "text",
              required: true,
              maxLength: 20,
            },
          ],
        },
        {
          label: "Cuota y pago",
          fields: [
            {
              name: "cuota_mensual",
              label: "Cuota mensual (€)",
              type: "number",
              required: true,
              min: 10,
            },
            {
              name: "iban",
              label: "IBAN",
              type: "text",
              required: true,
              maxLength: 34,
            },
          ],
        },
        {
          label: "Preferencias",
          fields: [
            {
              name: "transferencia_automatica",
              label: "Transferencia automática cuando el perro sea adoptado",
              type: "checkbox",
              required: false,
            },
            {
              name: "suscripcion_boletin",
              label: "Suscripción a boletín exclusivo",
              type: "checkbox",
              required: false,
            },
          ],
        },
        {
          label: "Autorizaciones",
          fields: [
            {
              name: "autorizacion_cargos",
              label: "Autorización de cargos bancarios",
              type: "checkbox",
              required: true,
            },
            {
              name: "politica_privacidad",
              label: "Aceptación de política de privacidad",
              type: "checkbox",
              required: true,
            },
          ],
        },
      ],
    },
  ],
} as CollectionConfig;
