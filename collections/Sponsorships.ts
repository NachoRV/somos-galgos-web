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
              required: false,
              maxLength: 100,
              admin: {
                description: "Nombre del perro proporcionado en el formulario",
              },
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
              name: "fee_frequency",
              label: "Frecuencia de pago",
              type: "select",
              required: false,
              defaultValue: "monthly",
              options: [
                { label: "Mensual", value: "monthly" },
                { label: "Trimestral", value: "quarterly" },
                { label: "Semestral", value: "semiannual" },
                { label: "Anual", value: "annual" },
              ],
              admin: {
                description: "Frecuencia con la que se realizará el pago",
              },
            },
            {
              name: "iban",
              label: "IBAN",
              type: "text",
              required: true,
              maxLength: 34,
            },
            {
              name: "bank_control_number",
              label: "Número de control bancario",
              type: "text",
              required: false,
              maxLength: 50,
              admin: {
                description: "Número de control interno del banco",
              },
            },
            {
              name: "receipt_reference",
              label: "Referencia del recibo",
              type: "text",
              required: false,
              maxLength: 100,
              admin: {
                description: "Referencia interna del recibo",
              },
            },
            {
              name: "first_receipt_date",
              label: "Fecha del primer recibo",
              type: "date",
              required: false,
              admin: {
                description: "Fecha en la que se emitió el primer recibo",
              },
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
        {
          label: "Gestión",
          fields: [
            {
              name: "registration_date",
              label: "Fecha de alta",
              type: "date",
              required: false,
              admin: {
                description: "Fecha de registro del apadrinamiento",
                readOnly: true,
                position: "sidebar",
              },
            },
            {
              name: "sponsor_mode",
              label: "Modo de patrocinio",
              type: "select",
              required: false,
              defaultValue: "padrino",
              options: [
                { label: "Padrino", value: "padrino" },
                { label: "Socio", value: "socio" },
              ],
              admin: {
                description: "Tipo de patrocinio: padrino (apadrinamiento) o socio",
                position: "sidebar",
              },
            },
            {
              name: "status",
              label: "Estado",
              type: "select",
              required: false,
              defaultValue: "en revision",
              options: [
                { label: "En revisión", value: "en revision" },
                { label: "Alta", value: "alta" },
                { label: "Baja", value: "baja" },
              ],
              admin: {
                description: "Estado actual del apadrinamiento",
                position: "sidebar",
              },
            },
          ],
        },
      ],
    },
  ],
} as CollectionConfig;
