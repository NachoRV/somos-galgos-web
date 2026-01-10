import { z } from 'zod';

export const adoptionSchema = z.object({
  firstName: z.string().min(2, 'El nombre es obligatorio'),
  lastName: z.string().min(2, 'Los apellidos son obligatorios'),
  idDocument: z.string().min(8, 'El DNI/NIE es obligatorio'),
  street: z.string().min(5, 'La calle es obligatoria'),
  city: z.string().min(2, 'La localidad es obligatoria'),
  postalCode: z.string().min(4, 'El código postal es obligatorio').max(10),
  province: z.string().min(2, 'La provincia es obligatoria'),
  birthYear: z.string().regex(/^\d{4}$/, 'Año inválido (formato: AAAA)'),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed', 'partner'], {
    message: 'Selecciona un estado civil',
  }),
  profession: z.string().min(2, 'La profesión es obligatoria'),
  phone: z
    .string()
    .min(9, 'El teléfono es obligatorio')
    .regex(/^[\d+\-()\s]+$/, 'Teléfono inválido'),
  email: z.string().email('Email inválido'),
  additionalInfo: z.string().optional(),
  dogId: z.string().optional(),
  dogName: z.string().optional(),
});

export type AdoptionFormData = z.infer<typeof adoptionSchema>;
