'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { adoptionSchema, type AdoptionFormData } from '@/lib/validations/adoption';
import { sendAdoptionEmail } from '@/lib/actions/sendAdoptionEmail';

interface AdoptionFormWizardProps {
  dogId?: string;
  dogName?: string;
}

const STEPS = [
  'personalInfo',
  'address',
  'housing',
  'family',
  'motivation',
  'care',
  'health',
  'behavior',
];

// Campos obligatorios por paso
const REQUIRED_FIELDS_BY_STEP: Record<number, string[]> = {
  0: ['firstName', 'lastName', 'email', 'phone', 'birthYear'],
  1: ['street', 'city', 'province', 'postalCode'],
  2: ['housingType', 'housingOwnership'],
  3: ['familyAgrees'],
  4: ['adoptionReason', 'adoptionTimeline'],
  5: [], // Sin campos obligatorios
  6: [], // Sin campos obligatorios
  7: ['homeVisitConsent', 'adoptionFeeConsent'],
};

export function AdoptionFormWizard({ dogId, dogName }: AdoptionFormWizardProps) {
  const t = useTranslations('Adoption');
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<AdoptionFormData>>({
    dogId,
    dogName,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? '' : value,
    }));
    // Limpiar error del campo al editar
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    const requiredFields = REQUIRED_FIELDS_BY_STEP[step] || [];
    const newErrors: Record<string, string> = {};

    // Validar campos obligatorios del paso actual
    requiredFields.forEach((field) => {
      const value = formData[field as keyof AdoptionFormData];
      if (!value || value === '') {
        newErrors[field] = t(`${field}Required`) || 'Este campo es obligatorio';
      }
    });

    // Validaciones específicas adicionales
    if (step === 0) {
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Email inválido';
      }
      if (formData.birthYear) {
        const year = parseInt(formData.birthYear);
        const age = 2026 - year;
        if (age < 18) {
          newErrors.birthYear = 'Debes ser mayor de 18 años';
        }
      }
    }

    if (step === 1) {
      if (formData.postalCode && !/^\d{5}$/.test(formData.postalCode)) {
        newErrors.postalCode = 'Código postal debe tener 5 dígitos';
      }
    }

    if (step === 4) {
      if (formData.adoptionReason && formData.adoptionReason.length < 20) {
        newErrors.adoptionReason = 'Por favor, explica tu motivación (mínimo 20 caracteres)';
      }
      if (formData.adoptionTimeline && formData.adoptionTimeline.length < 3) {
        newErrors.adoptionTimeline = 'Indica cuándo podrías recibir al galgo (mínimo 3 caracteres)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== SUBMIT INICIADO ===');
    console.log('Paso actual:', currentStep);
    console.log('Total pasos:', STEPS.length);
    
    if (!validateStep(currentStep)) {
      console.log('Validación del paso falló');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Validar con schema
      console.log('Validando con schema...');
      const parsed = adoptionSchema.safeParse(formData);
      if (!parsed.success) {
        console.log('Schema validation failed:', parsed.error);
        const fieldErrors = Object.fromEntries(
          Object.entries(parsed.error.flatten().fieldErrors).map(([key, value]) => [
            key,
            value?.[0] || 'Campo inválido',
          ])
        );
        setErrors(fieldErrors);
        
        // Encontrar el primer paso con errores y redirigir
        const errorFields = Object.keys(fieldErrors);
        for (let step = 0; step < STEPS.length; step++) {
          const stepFields = REQUIRED_FIELDS_BY_STEP[step] || [];
          if (stepFields.some(field => errorFields.includes(field))) {
            setCurrentStep(step);
            console.log('Redirigiendo al paso con errores:', step);
            break;
          }
        }
        
        setIsSubmitting(false);
        return;
      }

      console.log('Enviando a server action...');
      const response = await sendAdoptionEmail(parsed.data);
      console.log('Respuesta:', response);

      if (response.success) {
        setSubmitStatus('success');
        setFormData({ dogId, dogName });
        setCurrentStep(0);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{t(`step${currentStep + 1}Title`) || `Paso ${currentStep + 1} de ${STEPS.length}`}</h2>
          <span className="text-sm text-base-content/70">
            {currentStep + 1} / {STEPS.length}
          </span>
        </div>
        <progress
          className="progress progress-primary w-full"
          value={currentStep}
          max={STEPS.length - 1}
        />
      </div>

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="alert alert-success mb-6">
          <span>{t('successMessage')}</span>
        </div>
      )}
      {submitStatus === 'error' && (
        <div className="alert alert-error mb-6">
          <span>{t('errorMessage')}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Personal Info */}
        {currentStep === 0 && (
          <div className="space-y-4">
            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('firstName')} <span className="text-error">*</span></span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName || ''}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.firstName ? 'input-error' : ''}`}
                required
              />
              {errors.firstName && (
                <label className="label pb-2">
                  <span className="label-text-alt text-error w-full text-wrap">{errors.firstName}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('lastName')} <span className="text-error">*</span></span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName || ''}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.lastName ? 'input-error' : ''}`}
                required
              />
              {errors.lastName && (
                <label className="label pb-2">
                  <span className="label-text-alt text-error w-full text-wrap">{errors.lastName}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('idDocument')}</span>
              </label>
              <input
                type="text"
                name="idDocument"
                value={formData.idDocument || ''}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.idDocument ? 'input-error' : ''}`}
              />
              {errors.idDocument && (
                <label className="label pb-2">
                  <span className="label-text-alt text-error w-full text-wrap">{errors.idDocument}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('email')} <span className="text-error">*</span></span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                required
              />
              {errors.email && (
                <label className="label pb-2">
                  <span className="label-text-alt text-error w-full text-wrap">{errors.email}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('phone')} <span className="text-error">*</span></span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.phone ? 'input-error' : ''}`}
                required
              />
              {errors.phone && (
                <label className="label pb-2">
                  <span className="label-text-alt text-error w-full text-wrap">{errors.phone}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('birthYear')} <span className="text-error">*</span></span>
              </label>
              <input
                type="text"
                name="birthYear"
                value={formData.birthYear || ''}
                onChange={handleChange}
                placeholder="1990"
                className={`input input-bordered w-full ${errors.birthYear ? 'input-error' : ''}`}
              />
              {errors.birthYear && (
                <label className="label pb-2">
                  <span className="label-text-alt text-error w-full text-wrap">{errors.birthYear}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('maritalStatus')}</span>
              </label>
              <select
                name="maritalStatus"
                value={formData.maritalStatus || ''}
                onChange={handleChange}
                className={`select select-bordered w-full ${errors.maritalStatus ? 'select-error' : ''}`}
              >
                <option value="">{t('selectMaritalStatus')}</option>
                <option value="single">{t('single')}</option>
                <option value="married">{t('married')}</option>
                <option value="divorced">{t('divorced')}</option>
                <option value="widowed">{t('widowed')}</option>
                <option value="partner">{t('partner')}</option>
              </select>
              {errors.maritalStatus && (
                <label className="label pb-2">
                  <span className="label-text-alt text-error w-full text-wrap">{errors.maritalStatus}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('profession')}</span>
              </label>
              <input
                type="text"
                name="profession"
                value={formData.profession || ''}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.profession ? 'input-error' : ''}`}
              />
              {errors.profession && (
                <label className="label pb-2">
                  <span className="label-text-alt text-error w-full text-wrap">{errors.profession}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('otherContact')}</span>
              </label>
              <input
                type="text"
                name="otherContact"
                value={formData.otherContact || ''}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.otherContact ? 'input-error' : ''}`}
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('currentlyWorking')}</span>
              </label>
              <select
                name="currentlyWorking"
                value={(formData as any).currentlyWorking || ''}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">{t('selectOption')}</option>
                <option value="yes">{t('yes')}</option>
                <option value="no">{t('no')}</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('workStability')}</span>
              </label>
              <select
                name="workStability"
                value={(formData as any).workStability || ''}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">{t('selectOption')}</option>
                <option value="yes">{t('yes')}</option>
                <option value="no">{t('no')}</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('workSchedule')}</span>
              </label>
              <input
                type="text"
                name="workSchedule"
                value={(formData as any).workSchedule || ''}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('hobbies')}</span>
              </label>
              <textarea
                name="hobbies"
                value={(formData as any).hobbies || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Step 2: Address */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('street')} <span className="text-error">*</span></span>
              </label>
              <input
                type="text"
                name="street"
                value={formData.street || ''}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.street ? 'input-error' : ''}`}
                required
              />
              {errors.street && (
                <label className="label pb-2">
                  <span className="label-text-alt text-error w-full text-wrap">{errors.street}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('postalCode')} <span className="text-error">*</span></span>
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode || ''}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.postalCode ? 'input-error' : ''}`}
                maxLength={5}
                required
              />
              {errors.postalCode && (
                <label className="label pb-2">
                  <span className="label-text-alt text-error w-full text-wrap">{errors.postalCode}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('city')} <span className="text-error">*</span></span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city || ''}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.city ? 'input-error' : ''}`}
                required
              />
              {errors.city && (
                <label className="label pb-2">
                  <span className="label-text-alt text-error w-full text-wrap">{errors.city}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('province')} <span className="text-error">*</span></span>
              </label>
              <input
                type="text"
                name="province"
                value={formData.province || ''}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.province ? 'input-error' : ''}`}
                required
              />
              {errors.province && (
                <label className="label pb-2">
                  <span className="label-text-alt text-error w-full text-wrap">{errors.province}</span>
                </label>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Housing */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('housingType')} <span className="text-error">*</span></span>
              </label>
              <select
                name="housingType"
                value={formData.housingType || ''}
                onChange={handleChange}
                className={`select select-bordered w-full ${errors.housingType ? 'select-error' : ''}`}
                required
              >
                <option value="">{t('selectOption')}</option>
                <option value="apartment">{t('apartment')}</option>
                <option value="house">{t('house')}</option>
                <option value="townhouse">{t('townhouse')}</option>
                <option value="farm">{t('farm')}</option>
                <option value="other">{t('other')}</option>
              </select>
              {errors.housingType && (
                <label className="label pb-2">
                  <span className="label-text-alt text-error w-full text-wrap">{errors.housingType}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('housingSize')}</span>
              </label>
              <input
                type="text"
                name="housingSize"
                value={formData.housingSize || ''}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="m²"
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('hasGarden')}</span>
              </label>
              <select
                name="hasGarden"
                value={formData.hasGarden || ''}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">{t('selectOption')}</option>
                <option value="yes">{t('yes')}</option>
                <option value="no">{t('no')}</option>
              </select>
            </div>

            {formData.hasGarden === 'yes' && (
              <>
                <div className="form-control">
                  <label className="label pb-2">
                    <span className="label-text w-full text-wrap">{t('gardenFenced')}</span>
                  </label>
                  <select
                    name="gardenFenced"
                    value={formData.gardenFenced || ''}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                  >
                    <option value="">{t('selectOption')}</option>
                    <option value="yes">{t('yes')}</option>
                    <option value="no">{t('no')}</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label pb-2">
                    <span className="label-text w-full text-wrap">{t('fenceHeight')}</span>
                  </label>
                  <input
                    type="text"
                    name="fenceHeight"
                    value={formData.fenceHeight || ''}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="cm"
                  />
                </div>
              </>
            )}

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('housingOwnership')} <span className="text-error">*</span></span>
              </label>
              <select
                name="housingOwnership"
                value={formData.housingOwnership || ''}
                onChange={handleChange}
                className={`select select-bordered w-full ${errors.housingOwnership ? 'select-error' : ''}`}
                required
              >
                <option value="">{t('selectOption')}</option>
                <option value="owned">{t('owned')}</option>
                <option value="rented">{t('rented')}</option>
              </select>
              {errors.housingOwnership && (
                <label className="label pb-2">
                  <span className="label-text-alt text-error w-full text-wrap">{errors.housingOwnership}</span>
                </label>
              )}
            </div>

            {formData.housingOwnership === 'rented' && (
              <>
                <div className="form-control">
                  <label className="label pb-2">
                    <span className="label-text w-full text-wrap">{t('rentalPermission')}</span>
                  </label>
                  <select
                    name="rentalPermission"
                    value={formData.rentalPermission || ''}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                  >
                    <option value="">{t('selectOption')}</option>
                    <option value="yes">{t('yes')}</option>
                    <option value="no">{t('no')}</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label pb-2">
                    <span className="label-text w-full text-wrap">{t('rentalAnimalLimit')}</span>
                  </label>
                  <select
                    name="rentalAnimalLimit"
                    value={formData.rentalAnimalLimit || ''}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                  >
                    <option value="">{t('selectOption')}</option>
                    <option value="yes">{t('yes')}</option>
                    <option value="no">{t('no')}</option>
                  </select>
                </div>
              </>
            )}

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('neighborsConcern')}</span>
              </label>
              <select
                name="neighborsConcern"
                value={formData.neighborsConcern || ''}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">{t('selectOption')}</option>
                <option value="yes">{t('yes')}</option>
                <option value="no">{t('no')}</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 4: Family */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('household')}</span>
              </label>
              <textarea
                name="household"
                value={formData.household || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('childrenCount')}</span>
              </label>
              <input
                type="text"
                name="childrenCount"
                value={formData.childrenCount || ''}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('childrenAges')}</span>
              </label>
              <input
                type="text"
                name="childrenAges"
                value={formData.childrenAges || ''}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('familyAgrees')} <span className="text-error">*</span></span>
              </label>
              <select
                name="familyAgrees"
                value={formData.familyAgrees || ''}
                onChange={handleChange}
                className={`select select-bordered w-full ${errors.familyAgrees ? 'select-error' : ''}`}
                required
              >
                <option value="">{t('selectOption')}</option>
                <option value="yes">{t('yes')}</option>
                <option value="no">{t('no')}</option>
              </select>
              {errors.familyAgrees && (
                <label className="label pb-2">
                  <span className="label-text-alt text-error w-full text-wrap">{errors.familyAgrees}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('familyAllergies')}</span>
              </label>
              <select
                name="familyAllergies"
                value={formData.familyAllergies || ''}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">{t('selectOption')}</option>
                <option value="yes">{t('yes')}</option>
                <option value="no">{t('no')}</option>
              </select>
            </div>

            {formData.familyAllergies === 'yes' && (
              <div className="form-control">
                <label className="label pb-2">
                  <span className="label-text w-full text-wrap">{t('allergiesDescription')}</span>
                </label>
                <textarea
                  name="allergiesDescription"
                  value={formData.allergiesDescription || ''}
                  onChange={handleChange}
                  className="textarea textarea-bordered w-full"
                  rows={3}
                />
              </div>
            )}
          </div>
        )}

        {/* Step 5: Motivation & Experience */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('adoptionReason')} <span className="text-error">*</span></span>
                <span className="label-text-alt text-base-content/60">Mínimo 20 caracteres</span>
              </label>
              <textarea
                name="adoptionReason"
                value={formData.adoptionReason || ''}
                onChange={handleChange}
                className={`textarea textarea-bordered w-full ${errors.adoptionReason ? 'textarea-error' : ''}`}
                rows={3}
                required
              />
              {errors.adoptionReason && (
                <label className="label pb-2">
                  <span className="label-text-alt text-error w-full text-wrap">{errors.adoptionReason}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('adoptionPurpose')}</span>
              </label>
              <textarea
                name="adoptionPurpose"
                value={formData.adoptionPurpose || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('adoptionDecision')}</span>
              </label>
              <textarea
                name="adoptionDecision"
                value={formData.adoptionDecision || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('willingToFetch')}</span>
              </label>
              <select
                name="willingToFetch"
                value={formData.willingToFetch || ''}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">{t('selectOption')}</option>
                <option value="yes">{t('yes')}</option>
                <option value="no">{t('no')}</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('adoptionTimeline')} <span className="text-error">*</span></span>
              </label>
              <input
                type="text"
                name="adoptionTimeline"
                value={formData.adoptionTimeline || ''}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.adoptionTimeline ? 'input-error' : ''}`}
                required
              />
              {errors.adoptionTimeline && (
                <label className="label pb-2">
                  <span className="label-text-alt text-error w-full text-wrap">{errors.adoptionTimeline}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('knownNeeds')}</span>
              </label>
              <textarea
                name="knownNeeds"
                value={formData.knownNeeds || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('previousContact')}</span>
              </label>
              <textarea
                name="previousContact"
                value={formData.previousContact || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('previousDogs')}</span>
              </label>
              <select
                name="previousDogs"
                value={formData.previousDogs || ''}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">{t('selectOption')}</option>
                <option value="yes">{t('yes')}</option>
                <option value="no">{t('no')}</option>
              </select>
            </div>

            {formData.previousDogs === 'yes' && (
              <div className="form-control">
                <label className="label pb-2">
                  <span className="label-text w-full text-wrap">{t('previousExperience')}</span>
                </label>
                <textarea
                  name="previousExperience"
                  value={formData.previousExperience || ''}
                  onChange={handleChange}
                  className="textarea textarea-bordered w-full"
                  rows={3}
                />
              </div>
            )}

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('currentPets')}</span>
              </label>
              <textarea
                name="currentPets"
                value={formData.currentPets || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Step 6: Care & Walks */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('appropriateFood')}</span>
              </label>
              <textarea
                name="appropriateFood"
                value={formData.appropriateFood || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('dogExpenses')}</span>
              </label>
              <textarea
                name="dogExpenses"
                value={formData.dogExpenses || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('medicalExpenses')}</span>
              </label>
              <textarea
                name="medicalExpenses"
                value={formData.medicalExpenses || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('aloneLocation')}</span>
              </label>
              <textarea
                name="aloneLocation"
                value={formData.aloneLocation || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('aloneTime')}</span>
              </label>
              <input
                type="text"
                name="aloneTime"
                value={formData.aloneTime || ''}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('aloneTimeFuture')}</span>
              </label>
              <input
                type="text"
                name="aloneTimeFuture"
                value={formData.aloneTimeFuture || ''}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('walkFrequency')}</span>
              </label>
              <input
                type="text"
                name="walkFrequency"
                value={formData.walkFrequency || ''}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('morningWalkTime')}</span>
              </label>
              <input
                type="text"
                name="morningWalkTime"
                value={formData.morningWalkTime || ''}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('eveningWalkTime')}</span>
              </label>
              <input
                type="text"
                name="eveningWalkTime"
                value={formData.eveningWalkTime || ''}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('walkAreas')}</span>
              </label>
              <textarea
                name="walkAreas"
                value={formData.walkAreas || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('walkAccessories')}</span>
              </label>
              <textarea
                name="walkAccessories"
                value={formData.walkAccessories || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('offLeash')}</span>
              </label>
              <select
                name="offLeash"
                value={formData.offLeash || ''}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">{t('selectOption')}</option>
                <option value="yes">{t('yes')}</option>
                <option value="no">{t('no')}</option>
              </select>
            </div>

            {formData.offLeash === 'yes' && (
              <div className="form-control">
                <label className="label pb-2">
                  <span className="label-text w-full text-wrap">{t('offLeashWhere')}</span>
                </label>
                <textarea
                  name="offLeashWhere"
                  value={formData.offLeashWhere || ''}
                  onChange={handleChange}
                  className="textarea textarea-bordered w-full"
                  rows={3}
                />
              </div>
            )}

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('dogLocation')}</span>
              </label>
              <textarea
                name="dogLocation"
                value={formData.dogLocation || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('forbiddenRooms')}</span>
              </label>
              <textarea
                name="forbiddenRooms"
                value={formData.forbiddenRooms || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('sleepLocation')}</span>
              </label>
              <textarea
                name="sleepLocation"
                value={formData.sleepLocation || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('sofaPolicy')}</span>
              </label>
              <textarea
                name="sofaPolicy"
                value={formData.sofaPolicy || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('misbehaviorPolicy')}</span>
              </label>
              <textarea
                name="misbehaviorPolicy"
                value={formData.misbehaviorPolicy || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Step 7: Health & Vacation */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('badExperienceWithDog')}</span>
              </label>
              <textarea
                name="badExperienceWithDog"
                value={formData.badExperienceWithDog || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('vacationPlan')}</span>
              </label>
              <textarea
                name="vacationPlan"
                value={formData.vacationPlan || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('familyChangePolicy')}</span>
              </label>
              <textarea
                name="familyChangePolicy"
                value={formData.familyChangePolicy || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('veterinarianName')}</span>
              </label>
              <input
                type="text"
                name="veterinarianName"
                value={formData.veterinarianName || ''}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('veterinarianPhone')}</span>
              </label>
              <input
                type="tel"
                name="veterinarianPhone"
                value={formData.veterinarianPhone || ''}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('sterileAgreement')}</span>
              </label>
              <select
                name="sterileAgreement"
                value={formData.sterileAgreement || ''}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">{t('selectOption')}</option>
                <option value="yes">{t('yes')}</option>
                <option value="no">{t('no')}</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('dogTypePreference')}</span>
              </label>
              <textarea
                name="dogTypePreference"
                value={formData.dogTypePreference || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('dogTypeReason')}</span>
              </label>
              <textarea
                name="dogTypeReason"
                value={formData.dogTypeReason || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('physicalProblemTolerance')}</span>
              </label>
              <select
                name="physicalProblemTolerance"
                value={formData.physicalProblemTolerance || ''}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">{t('selectOption')}</option>
                <option value="yes">{t('yes')}</option>
                <option value="no">{t('no')}</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('puppyPreference')}</span>
              </label>
              <select
                name="puppyPreference"
                value={formData.puppyPreference || ''}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">{t('selectOption')}</option>
                <option value="yes">{t('yes')}</option>
                <option value="no">{t('no')}</option>
              </select>
            </div>

            {formData.puppyPreference === 'yes' && (
              <>
                <div className="form-control">
                  <label className="label pb-2">
                    <span className="label-text w-full text-wrap">{t('puppyWhy')}</span>
                  </label>
                  <textarea
                    name="puppyWhy"
                    value={formData.puppyWhy || ''}
                    onChange={handleChange}
                    className="textarea textarea-bordered w-full"
                    rows={3}
                  />
                </div>

                <div className="form-control">
                  <label className="label pb-2">
                    <span className="label-text w-full text-wrap">{t('puppyCare')}</span>
                  </label>
                  <textarea
                    name="puppyCare"
                    value={formData.puppyCare || ''}
                    onChange={handleChange}
                    className="textarea textarea-bordered w-full"
                    rows={3}
                  />
                </div>

                <div className="form-control">
                  <label className="label pb-2">
                    <span className="label-text w-full text-wrap">{t('puppyAdvantages')}</span>
                  </label>
                  <textarea
                    name="puppyAdvantages"
                    value={formData.puppyAdvantages || ''}
                    onChange={handleChange}
                    className="textarea textarea-bordered w-full"
                    rows={3}
                  />
                </div>

                <div className="form-control">
                  <label className="label pb-2">
                    <span className="label-text w-full text-wrap">{t('puppyDisadvantages')}</span>
                  </label>
                  <textarea
                    name="puppyDisadvantages"
                    value={formData.puppyDisadvantages || ''}
                    onChange={handleChange}
                    className="textarea textarea-bordered w-full"
                    rows={3}
                  />
                </div>
              </>
            )}

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('negativeDogAspect')}</span>
              </label>
              <textarea
                name="negativeDogAspect"
                value={formData.negativeDogAspect || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Step 8: Behavior, Commitments & Final Comments */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('behaviorProblems')}</span>
              </label>
              <textarea
                name="behaviorProblems"
                value={formData.behaviorProblems || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('behaviorCauses')}</span>
              </label>
              <textarea
                name="behaviorCauses"
                value={formData.behaviorCauses || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('behaviorSolvable')}</span>
              </label>
              <textarea
                name="behaviorSolvable"
                value={formData.behaviorSolvable || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('behaviorSolution')}</span>
              </label>
              <textarea
                name="behaviorSolution"
                value={formData.behaviorSolution || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('behaviorBooks')}</span>
              </label>
              <textarea
                name="behaviorBooks"
                value={formData.behaviorBooks || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('trainingMethods')}</span>
              </label>
              <textarea
                name="trainingMethods"
                value={formData.trainingMethods || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('housetrainingMethod')}</span>
              </label>
              <textarea
                name="housetrainingMethod"
                value={formData.housetrainingMethod || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('fearfulDogExperience')}</span>
              </label>
              <textarea
                name="fearfulDogExperience"
                value={formData.fearfulDogExperience || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('homeVisitConsent')} <span className="text-error">*</span></span>
              </label>
              <select
                name="homeVisitConsent"
                value={formData.homeVisitConsent || ''}
                onChange={handleChange}
                className={`select select-bordered w-full ${errors.homeVisitConsent ? 'select-error' : ''}`}
                required
              >
                <option value="">{t('selectOption')}</option>
                <option value="yes">{t('yes')}</option>
                <option value="no">{t('no')}</option>
              </select>
              {errors.homeVisitConsent && (
                <label className="label pb-2">
                  <span className="label-text-alt text-error w-full text-wrap">{errors.homeVisitConsent}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('postSurgeryInconvenience')}</span>
              </label>
              <select
                name="postSurgeryInconvenience"
                value={formData.postSurgeryInconvenience || ''}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">{t('selectOption')}</option>
                <option value="yes">{t('yes')}</option>
                <option value="no">{t('no')}</option>
              </select>
            </div>

            {formData.postSurgeryInconvenience === 'yes' && (
              <div className="form-control">
                <label className="label pb-2">
                  <span className="label-text w-full text-wrap">{t('postSurgeryDescription')}</span>
                </label>
                <textarea
                  name="postSurgeryDescription"
                  value={formData.postSurgeryDescription || ''}
                  onChange={handleChange}
                  className="textarea textarea-bordered w-full"
                  rows={3}
                />
              </div>
            )}

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('adoptionFeeConsent')} <span className="text-error">*</span></span>
                <span className="label-text-alt text-base-content/60">Cuota: 225€</span>
              </label>
              <select
                name="adoptionFeeConsent"
                value={formData.adoptionFeeConsent || ''}
                onChange={handleChange}
                className={`select select-bordered w-full ${errors.adoptionFeeConsent ? 'select-error' : ''}`}
                required
              >
                <option value="">{t('selectOption')}</option>
                <option value="yes">{t('yes')}</option>
                <option value="no">{t('no')}</option>
              </select>
              {errors.adoptionFeeConsent && (
                <label className="label pb-2">
                  <span className="label-text-alt text-error w-full text-wrap">{errors.adoptionFeeConsent}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('behaviorProblemsAware')}</span>
              </label>
              <select
                name="behaviorProblemsAware"
                value={formData.behaviorProblemsAware || ''}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">{t('selectOption')}</option>
                <option value="yes">{t('yes')}</option>
                <option value="no">{t('no')}</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('willingToConductWork')}</span>
              </label>
              <select
                name="willingToConductWork"
                value={formData.willingToConductWork || ''}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">{t('selectOption')}</option>
                <option value="yes">{t('yes')}</option>
                <option value="no">{t('no')}</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('willingToFollowAdvice')}</span>
              </label>
              <select
                name="willingToFollowAdvice"
                value={formData.willingToFollowAdvice || ''}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">{t('selectOption')}</option>
                <option value="yes">{t('yes')}</option>
                <option value="no">{t('no')}</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('fearsAware')}</span>
              </label>
              <select
                name="fearsAware"
                value={formData.fearsAware || ''}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">{t('selectOption')}</option>
                <option value="yes">{t('yes')}</option>
                <option value="no">{t('no')}</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('willingToHelpFears')}</span>
              </label>
              <select
                name="willingToHelpFears"
                value={formData.willingToHelpFears || ''}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">{t('selectOption')}</option>
                <option value="yes">{t('yes')}</option>
                <option value="no">{t('no')}</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('willingToFollowFearsAdvice')}</span>
              </label>
              <select
                name="willingToFollowFearsAdvice"
                value={formData.willingToFollowFearsAdvice || ''}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">{t('selectOption')}</option>
                <option value="yes">{t('yes')}</option>
                <option value="no">{t('no')}</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('additionalComments')}</span>
              </label>
              <textarea
                name="additionalComments"
                value={formData.additionalComments || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('howDidYouKnowUs')}</span>
              </label>
              <input
                type="text"
                name="howDidYouKnowUs"
                value={formData.howDidYouKnowUs || ''}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text w-full text-wrap">{t('formFeedback')}</span>
              </label>
              <textarea
                name="formFeedback"
                value={formData.formFeedback || ''}
                onChange={handleChange}
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4 mt-8">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="btn btn-secondary flex-1"
          >
            {t('previous')}
          </button>

          {currentStep < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary flex-1"
            >
              {t('next')}
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-success flex-1"
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner"></span>
                  {t('submitting')}
                </>
              ) : (
                t('submit')
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
