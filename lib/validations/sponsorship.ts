import { z } from 'zod';

export const sponsorshipSchema = z.object({
  firstName: z.string().min(2, 'El nombre es obligatorio'),
  lastName1: z.string().min(2, 'El primer apellido es obligatorio'),
  lastName2: z.string().min(2, 'El segundo apellido es obligatorio'),
  idDocument: z.string().min(8, 'El DNI/NIE/NIF es obligatorio'),
  street: z.string().min(5, 'La dirección es obligatoria'),
  city: z.string().min(2, 'La población es obligatoria'),
  postalCode: z.string().min(4, 'El código postal es obligatorio').max(10),
  province: z.string().min(2, 'La provincia es obligatoria'),
  email: z.string().email('Email inválido'),
  phone: z
    .string()
    .min(9, 'El teléfono es obligatorio')
    .regex(/^[\d+\-()\s]+$/, 'Teléfono inválido'),
  dogName: z.string().optional(),
  dogId: z.string().optional(),
  cuota: z.number().min(10, 'La cuota mínima es 10€'),
  fee_frequency: z.enum(['monthly', 'quarterly', 'semiannual', 'annual']).default('monthly'),
  iban: z
    .string()
    .min(24, 'IBAN inválido')
    .max(34, 'IBAN inválido')
    .regex(/^ES\d{22}$/, 'IBAN debe comenzar con ES y tener 22 dígitos'),
  transferencia_automatica: z.boolean().default(false),
  suscripcion_boletin: z.boolean().default(false),
  autorizacion_cargos: z.boolean().refine(val => val === true, {
    message: 'Debes autorizar los cargos bancarios',
  }),
  politica_privacidad: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar la política de privacidad',
  }),
});

export type SponsorshipFormData = z.infer<typeof sponsorshipSchema>;
