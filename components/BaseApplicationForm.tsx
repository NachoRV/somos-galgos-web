'use client';
import { useTranslations } from 'next-intl';
import type { AdoptionFormData } from '@/lib/validations/adoption';

interface BaseApplicationFormProps {
  formData: Partial<AdoptionFormData>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  submitStatus: 'idle' | 'success' | 'error';
  translationNamespace: 'Adoption' | 'Foster';
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export function BaseApplicationForm({
  formData,
  errors,
  isSubmitting,
  submitStatus,
  translationNamespace,
  handleChange,
  handleSubmit,
}: BaseApplicationFormProps) {
  const t = useTranslations(translationNamespace);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-base-200 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">{t('personalInfo')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label pb-2"><span className="label-text w-full">{t('firstName')} *</span></label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={`input input-bordered w-full ${errors.firstName ? 'input-error' : ''}`} required />
            {errors.firstName && <label className="label"><span className="label-text-alt text-error w-full">{errors.firstName}</span></label>}
          </div>
          <div className="form-control">
            <label className="label pb-2"><span className="label-text w-full">{t('lastName')} *</span></label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={`input input-bordered w-full ${errors.lastName ? 'input-error' : ''}`} required />
            {errors.lastName && <label className="label"><span className="label-text-alt text-error w-full">{errors.lastName}</span></label>}
          </div>
          <div className="form-control">
            <label className="label pb-2"><span className="label-text w-full">{t('idDocument')} *</span></label>
            <input type="text" name="idDocument" value={formData.idDocument} onChange={handleChange} className={`input input-bordered w-full ${errors.idDocument ? 'input-error' : ''}`} required />
            {errors.idDocument && <label className="label"><span className="label-text-alt text-error w-full">{errors.idDocument}</span></label>}
          </div>
          <div className="form-control">
            <label className="label pb-2"><span className="label-text w-full">{t('birthYear')} *</span></label>
            <input type="text" name="birthYear" value={formData.birthYear} onChange={handleChange} placeholder="1990" className={`input input-bordered w-full ${errors.birthYear ? 'input-error' : ''}`} required />
            {errors.birthYear && <label className="label"><span className="label-text-alt text-error w-full">{errors.birthYear}</span></label>}
          </div>
          <div className="form-control">
            <label className="label pb-2"><span className="label-text w-full">{t('maritalStatus')} *</span></label>
            <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className={`select select-bordered w-full ${errors.maritalStatus ? 'select-error' : ''}`} required>
              <option value="single">{t('single')}</option>
              <option value="married">{t('married')}</option>
              <option value="divorced">{t('divorced')}</option>
              <option value="widowed">{t('widowed')}</option>
              <option value="partner">{t('partner')}</option>
            </select>
            {errors.maritalStatus && <label className="label"><span className="label-text-alt text-error w-full">{errors.maritalStatus}</span></label>}
          </div>
          <div className="form-control">
            <label className="label pb-2"><span className="label-text w-full">{t('profession')} *</span></label>
            <input type="text" name="profession" value={formData.profession} onChange={handleChange} className={`input input-bordered w-full ${errors.profession ? 'input-error' : ''}`} required />
            {errors.profession && <label className="label"><span className="label-text-alt text-error w-full">{errors.profession}</span></label>}
          </div>
        </div>
      </div>

      <div className="bg-base-200 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">{t('addressInfo')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control md:col-span-2">
            <label className="label pb-2"><span className="label-text w-full">{t('street')} *</span></label>
            <input type="text" name="street" value={formData.street} onChange={handleChange} className={`input input-bordered w-full ${errors.street ? 'input-error' : ''}`} required />
            {errors.street && <label className="label"><span className="label-text-alt text-error w-full">{errors.street}</span></label>}
          </div>
          <div className="form-control">
            <label className="label pb-2"><span className="label-text w-full">{t('city')} *</span></label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} className={`input input-bordered w-full ${errors.city ? 'input-error' : ''}`} required />
            {errors.city && <label className="label"><span className="label-text-alt text-error w-full">{errors.city}</span></label>}
          </div>
          <div className="form-control">
            <label className="label pb-2"><span className="label-text w-full">{t('postalCode')} *</span></label>
            <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className={`input input-bordered w-full ${errors.postalCode ? 'input-error' : ''}`} required />
            {errors.postalCode && <label className="label"><span className="label-text-alt text-error w-full">{errors.postalCode}</span></label>}
          </div>
          <div className="form-control md:col-span-2">
            <label className="label pb-2"><span className="label-text w-full">{t('province')} *</span></label>
            <input type="text" name="province" value={formData.province} onChange={handleChange} className={`input input-bordered w-full ${errors.province ? 'input-error' : ''}`} required />
            {errors.province && <label className="label"><span className="label-text-alt text-error w-full">{errors.province}</span></label>}
          </div>
        </div>
      </div>

      <div className="bg-base-200 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">{t('contactInfo')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label pb-2"><span className="label-text w-full">{t('phone')} *</span></label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`input input-bordered w-full ${errors.phone ? 'input-error' : ''}`} required />
            {errors.phone && <label className="label"><span className="label-text-alt text-error w-full">{errors.phone}</span></label>}
          </div>
          <div className="form-control">
            <label className="label pb-2"><span className="label-text w-full">{t('email')} *</span></label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`} required />
            {errors.email && <label className="label"><span className="label-text-alt text-error w-full">{errors.email}</span></label>}
          </div>
        </div>
      </div>

      <div className="bg-base-200 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">{t('additionalInfo')}</h3>
        <div className="form-control">
          <label className="label pb-2"><span className="label-text w-full">{t('additionalInfoLabel')}</span></label>
          <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} className="textarea textarea-bordered w-full h-32" placeholder={t('additionalInfoPlaceholder')} />
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
