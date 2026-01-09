import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio'),
  email: z.string().email('Email inválido'),
  phone: z
    .string()
    .min(7, 'Teléfono obligatorio')
    .max(20, 'Teléfono inválido')
    .regex(/^[\d+\-()\s]+$/, 'Teléfono inválido'),
  subject: z.string().min(2, 'El asunto es obligatorio'),
  message: z.string().min(10, 'El mensaje es obligatorio'),
});

export type ContactFormData = z.infer<typeof contactSchema>;