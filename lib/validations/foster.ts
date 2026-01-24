import { z } from 'zod';

export const fosterSchema = z.object({
  // Paso 1: Datos Personales (5 OBLIGATORIOS)
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  idDocument: z.string().optional().or(z.literal('')),
  email: z.string().email('Email inválido'),
  phone: z.string().regex(/^[\d+\-()\s]{9,}$/, 'Teléfono debe tener al menos 9 dígitos'),
  birthYear: z.string()
    .regex(/^\d{4}$/, 'Año debe tener 4 dígitos')
    .refine(val => {
      const year = parseInt(val);
      const age = 2026 - year;
      return age >= 18 && age <= 100;
    }, 'Debes ser mayor de 18 años'),
  maritalStatus: z.enum(['', 'single', 'married', 'divorced', 'widowed', 'partner']).optional(),
  profession: z.string().optional().or(z.literal('')),
  otherContact: z.string().optional().or(z.literal('')),

  // Paso 2: Domicilio (4 OBLIGATORIOS)
  street: z.string().min(3, 'La calle debe tener al menos 3 caracteres'),
  postalCode: z.string().regex(/^\d{5}$/, 'Código postal debe tener 5 dígitos'),
  city: z.string().min(2, 'La ciudad es obligatoria'),
  province: z.string().min(2, 'La provincia es obligatoria'),

  // Paso 3: Vivienda (2 OBLIGATORIOS)
  housingType: z.enum(['apartment', 'house', 'townhouse', 'farm', 'other']),
  housingSize: z.string().optional().or(z.literal('')),
  hasGarden: z.enum(['', 'yes', 'no']).optional(),
  gardenFenced: z.enum(['', 'yes', 'no']).optional(),
  fenceHeight: z.string().optional().or(z.literal('')),
  housingOwnership: z.enum(['owned', 'rented']),
  rentalPermission: z.enum(['', 'yes', 'no']).optional(),
  rentalAnimalLimit: z.enum(['', 'yes', 'no']).optional(),
  neighborsConcern: z.enum(['', 'yes', 'no']).optional(),

  // Paso 4: Familia y Convivencia (1 OBLIGATORIO)
  household: z.string().optional().or(z.literal('')),
  childrenCount: z.string().optional().or(z.literal('')),
  childrenAges: z.string().optional().or(z.literal('')),
  familyAgrees: z.enum(['yes']),
  familyAllergies: z.enum(['', 'yes', 'no']).optional(),
  allergiesDescription: z.string().optional().or(z.literal('')),

  // Paso 5: Motivación y Experiencia (2 OBLIGATORIOS)
  adoptionReason: z.string().min(20, 'Por favor, explica tu motivación (mínimo 20 caracteres)'),
  adoptionPurpose: z.string().optional().or(z.literal('')),
  adoptionDecision: z.string().optional().or(z.literal('')),
  willingToFetch: z.enum(['', 'yes', 'no']).optional(),
  adoptionTimeline: z.string().min(3, 'Indica cuándo podrías recibir al galgo'),
  knownNeeds: z.string().optional().or(z.literal('')),
  previousContact: z.string().optional().or(z.literal('')),
  previousDogs: z.enum(['', 'yes', 'no']).optional(),
  previousExperience: z.string().optional().or(z.literal('')),
  currentPets: z.string().optional().or(z.literal('')),
  petTypes: z.string().optional().or(z.literal('')),
  aloneTime: z.string().optional().or(z.literal('')),
  aloneTimeFuture: z.string().optional().or(z.literal('')),

  // Paso 6: Cuidados y Paseos
  appropriateFood: z.string().optional().or(z.literal('')),
  dogExpenses: z.string().optional().or(z.literal('')),
  medicalExpenses: z.string().optional().or(z.literal('')),
  aloneLocation: z.string().optional().or(z.literal('')),
  walkFrequency: z.string().optional().or(z.literal('')),
  morningWalkTime: z.string().optional().or(z.literal('')),
  eveningWalkTime: z.string().optional().or(z.literal('')),
  walkAreas: z.string().optional().or(z.literal('')),
  walkAccessories: z.string().optional().or(z.literal('')),
  offLeash: z.enum(['', 'yes', 'no']).optional(),
  offLeashWhere: z.string().optional().or(z.literal('')),
  dogLocation: z.string().optional().or(z.literal('')),
  forbiddenRooms: z.string().optional().or(z.literal('')),
  sleepLocation: z.string().optional().or(z.literal('')),
  sofaPolicy: z.string().optional().or(z.literal('')),
  misbehaviorPolicy: z.string().optional().or(z.literal('')),

  // Paso 7: Salud, Vacaciones y Vida Familiar
  veterinarianName: z.string().optional().or(z.literal('')),
  veterinarianPhone: z.string().optional().or(z.literal('')),
  vacationPlan: z.string().optional().or(z.literal('')),
  familyChangePolicy: z.string().optional().or(z.literal('')),
  sterileAgreement: z.enum(['', 'yes', 'no']).optional(),
  dogTypePreference: z.string().optional().or(z.literal('')),
  dogTypeReason: z.string().optional().or(z.literal('')),
  physicalProblemTolerance: z.enum(['', 'yes', 'no']).optional(),
  puppyPreference: z.enum(['', 'yes', 'no']).optional(),
  puppyAdvantages: z.string().optional().or(z.literal('')),
  puppyDisadvantages: z.string().optional().or(z.literal('')),
  puppyWhy: z.string().optional().or(z.literal('')),
  puppyCare: z.string().optional().or(z.literal('')),
  negativeDogAspect: z.string().optional().or(z.literal('')),

  // Paso 8: Conducta, Compromisos y Comentarios Finales (2 OBLIGATORIOS)
  behaviorProblems: z.string().optional().or(z.literal('')),
  behaviorCauses: z.string().optional().or(z.literal('')),
  behaviorSolvable: z.string().optional().or(z.literal('')),
  behaviorSolution: z.string().optional().or(z.literal('')),
  behaviorBooks: z.string().optional().or(z.literal('')),
  trainingMethods: z.string().optional().or(z.literal('')),
  housetrainingMethod: z.string().optional().or(z.literal('')),
  fearfulDogExperience: z.string().optional().or(z.literal('')),
  badExperienceWithDog: z.string().optional().or(z.literal('')),
  homeVisitConsent: z.enum(['yes']),
  postSurgeryInconvenience: z.enum(['', 'yes', 'no']).optional(),
  postSurgeryDescription: z.string().optional().or(z.literal('')),
  behaviorProblemsAware: z.enum(['', 'yes', 'no']).optional(),
  willingToConductWork: z.enum(['', 'yes', 'no']).optional(),
  willingToFollowAdvice: z.enum(['', 'yes', 'no']).optional(),
  fearsAware: z.enum(['', 'yes', 'no']).optional(),
  willingToHelpFears: z.enum(['', 'yes', 'no']).optional(),
  willingToFollowFearsAdvice: z.enum(['', 'yes', 'no']).optional(),
  additionalComments: z.string().optional().or(z.literal('')),
  howDidYouKnowUs: z.string().optional().or(z.literal('')),
  formFeedback: z.string().optional().or(z.literal('')),

  // Campos específicos de acogida
  currentlyWorking: z.enum(['', 'yes', 'no']).optional(),
  workStability: z.enum(['', 'yes', 'no']).optional(),
  workSchedule: z.string().optional().or(z.literal('')),
  hobbies: z.string().optional().or(z.literal('')),
  fosterEndDate: z.string().optional().or(z.literal('')),

  // Campos heredados
  additionalInfo: z.string().optional().or(z.literal('')),
  dogId: z.string().optional(),
  dogName: z.string().optional(),
});

export type FosterFormData = z.infer<typeof fosterSchema>;
