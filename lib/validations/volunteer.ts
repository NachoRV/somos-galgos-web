import { z } from 'zod';

export const volunteerSchema = z.object({
  fullName: z.string()
    .min(1, 'Full name is required')
    .min(3, 'Name must be at least 3 characters')
    .trim(),
  dni: z.string()
    .min(1, 'DNI/NIE is required')
    .min(5, 'DNI must be valid')
    .max(20, 'DNI too long')
    .trim(),
  birthDate: z.string()
    .min(1, 'Birth date is required')
    .refine((date) => {
      const d = new Date(date);
      return !isNaN(d.getTime());
    }, 'Invalid date format'),
  residenceLocation: z.string()
    .min(1, 'Residence location is required')
    .min(3, 'Location must be at least 3 characters')
    .trim(),
  phone: z.string()
    .min(1, 'Phone is required')
    .min(9, 'Phone must be at least 9 characters')
    .trim(),
  drivingLicense: z.enum(['si_carnet', 'si_carnet_coche', 'no_carnet'], {
    errorMap: () => ({ message: 'Please select a driving license option' }),
  }),
});

export type VolunteerFormData = z.infer<typeof volunteerSchema>;
