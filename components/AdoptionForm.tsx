'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { adoptionSchema, type AdoptionFormData } from '@/lib/validations/adoption';
import { sendAdoptionEmail } from '@/lib/actions/sendAdoptionEmail';

interface AdoptionFormProps {
  dogId?: string;
  dogName?: string;
}

export function AdoptionForm({ dogId, dogName }: AdoptionFormProps) {
  const t = useTranslations('Adoption');
  const [formData, setFormData] = useState<AdoptionFormData>({
    firstName: '',
    lastName: '',
    idDocument: '',
    street: '',
    city: '',
    postalCode: '',
    province: '',
    birthYear: '',
    maritalStatus: 'single',
    profession: '',
    phone: '',
    email: '',
    additionalInfo: '',
    dogId: dogId || '',
    dogName: dogName || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSubmitStatus('idle');

    try {
      // Validar con Zod
      adoptionSchema.parse(formData);
      
      // Enviar email
      const result = await sendAdoptionEmail(formData);
      
      if (result.error) {
        setSubmitStatus('error');
        if (typeof result.error === 'object') {
          setErrors(result.error as Record<string, string>);
        }
      } else {
        setSubmitStatus('success');
        // Resetear formulario pero mantener dogId y dogName si existen
        setFormData({
          firstName: '',
          lastName: '',
          idDocument: '',
          street: '',
          city: '',
          postalCode: '',
          province: '',
          birthYear: '',
          maritalStatus: 'single',
          profession: '',
          phone: '',
          email: '',
          additionalInfo: '',
          dogId: dogId || '',
          dogName: dogName || '',
        });
      }
    } catch (error: any) {
      if (error.errors) {
        const formErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          if (err.path) {
            formErrors[err.path[0]] = err.message;
          }
        });
        setErrors(formErrors);
      } else {
        setSubmitStatus('error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-base-200 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">{t('personalInfo')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label"><span className="label-text">{t('firstName')} *</span></label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={`input input-bordered ${errors.firstName ? 'input-error' : ''}`} required />
            {errors.firstName && <label className="label"><span className="label-text-alt text-error">{errors.firstName}</span></label>}
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">{t('lastName')} *</span></label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={`input input-bordered ${errors.lastName ? 'input-error' : ''}`} required />
            {errors.lastName && <label className="label"><span className="label-text-alt text-error">{errors.lastName}</span></label>}
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">{t('idDocument')} *</span></label>
            <input type="text" name="idDocument" value={formData.idDocument} onChange={handleChange} className={`input input-bordered ${errors.idDocument ? 'input-error' : ''}`} required />
            {errors.idDocument && <label className="label"><span className="label-text-alt text-error">{errors.idDocument}</span></label>}
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">{t('birthYear')} *</span></label>
            <input type="text" name="birthYear" value={formData.birthYear} onChange={handleChange} placeholder="1990" className={`input input-bordered ${errors.birthYear ? 'input-error' : ''}`} required />
            {errors.birthYear && <label className="label"><span className="label-text-alt text-error">{errors.birthYear}</span></label>}
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">{t('maritalStatus')} *</span></label>
            <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className={`select select-bordered ${errors.maritalStatus ? 'select-error' : ''}`} required>
              <option value="single">{t('single')}</option>
              <option value="married">{t('married')}</option>
              <option value="divorced">{t('divorced')}</option>
              <option value="widowed">{t('widowed')}</option>
              <option value="partner">{t('partner')}</option>
            </select>
            {errors.maritalStatus && <label className="label"><span className="label-text-alt text-error">{errors.maritalStatus}</span></label>}
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">{t('profession')} *</span></label>
            <input type="text" name="profession" value={formData.profession} onChange={handleChange} className={`input input-bordered ${errors.profession ? 'input-error' : ''}`} required />
            {errors.profession && <label className="label"><span className="label-text-alt text-error">{errors.profession}</span></label>}
          </div>
        </div>
      </div>

      <div className="bg-base-200 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">{t('addressInfo')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control md:col-span-2">
            <label className="label"><span className="label-text">{t('street')} *</span></label>
            <input type="text" name="street" value={formData.street} onChange={handleChange} className={`input input-bordered ${errors.street ? 'input-error' : ''}`} required />
            {errors.street && <label className="label"><span className="label-text-alt text-error">{errors.street}</span></label>}
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">{t('city')} *</span></label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} className={`input input-bordered ${errors.city ? 'input-error' : ''}`} required />
            {errors.city && <label className="label"><span className="label-text-alt text-error">{errors.city}</span></label>}
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">{t('postalCode')} *</span></label>
            <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className={`input input-bordered ${errors.postalCode ? 'input-error' : ''}`} required />
            {errors.postalCode && <label className="label"><span className="label-text-alt text-error">{errors.postalCode}</span></label>}
          </div>
          <div className="form-control md:col-span-2">
            <label className="label"><span className="label-text">{t('province')} *</span></label>
            <input type="text" name="province" value={formData.province} onChange={handleChange} className={`input input-bordered ${errors.province ? 'input-error' : ''}`} required />
            {errors.province && <label className="label"><span className="label-text-alt text-error">{errors.province}</span></label>}
          </div>
        </div>
      </div>

      <div className="bg-base-200 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">{t('contactInfo')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label"><span className="label-text">{t('phone')} *</span></label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`input input-bordered ${errors.phone ? 'input-error' : ''}`} required />
            {errors.phone && <label className="label"><span className="label-text-alt text-error">{errors.phone}</span></label>}
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">{t('email')} *</span></label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className={`input input-bordered ${errors.email ? 'input-error' : ''}`} required />
            {errors.email && <label className="label"><span className="label-text-alt text-error">{errors.email}</span></label>}
          </div>
        </div>
      </div>

      <div className="bg-base-200 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">{t('additionalInfo')}</h3>
        <div className="form-control">
          <label className="label"><span className="label-text">{t('additionalInfoLabel')}</span></label>
          <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} className="textarea textarea-bordered h-32" placeholder={t('additionalInfoPlaceholder')} />
        </div>
      </div>

      {submitStatus === 'success' && <div className="alert alert-success"><span>{t('successMessage')}</span></div>}
      {submitStatus === 'error' && <div className="alert alert-error"><span>{t('errorMessage')}</span></div>}

      <button type="submit" className="btn btn-primary w-full btn-lg" disabled={isSubmitting}>
        {isSubmitting ? <><span className="loading loading-spinner"></span>{t('submitting')}</> : t('submit')}
      </button>
    </form>
  );
}
