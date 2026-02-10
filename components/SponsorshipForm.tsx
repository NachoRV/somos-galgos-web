'use client';
import { sendSponsorshipEmail } from '@/lib/actions/sendSponsorshipEmail';
import { useSponsorshipForm } from '@/hooks/useSponsorshipForm';
import { useTranslations } from 'next-intl';

interface SponsorshipFormProps {
  dogId?: string;
  dogName?: string;
  sponsorMode?: 'padrino' | 'socio';
}

export function SponsorshipForm({ dogId, dogName, sponsorMode = 'padrino' }: SponsorshipFormProps) {
  const formState = useSponsorshipForm({
    dogId,
    dogName,
    sponsorMode,
    onSubmit: sendSponsorshipEmail,
  });
  const t = useTranslations(sponsorMode === 'socio' ? 'Member' : 'Sponsorship');
  const { formData, errors, isSubmitting, submitStatus, handleChange, handleSubmit } = formState;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Datos Personales */}
      <div className="bg-base-200 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">{t('personalInfo')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label pb-2"><span className="label-text w-full">{t('firstName')} *</span></label>
            <input 
              type="text" 
              name="firstName" 
              value={formData.firstName} 
              onChange={handleChange} 
              className={`input input-bordered w-full ${errors.firstName ? 'input-error' : ''}`} 
              required 
            />
            {errors.firstName && <label className="label"><span className="label-text-alt text-error w-full">{errors.firstName}</span></label>}
          </div>
          <div className="form-control">
            <label className="label pb-2"><span className="label-text w-full">{t('lastName1')} *</span></label>
            <input 
              type="text" 
              name="lastName1" 
              value={formData.lastName1} 
              onChange={handleChange} 
              className={`input input-bordered w-full ${errors.lastName1 ? 'input-error' : ''}`} 
              required 
            />
            {errors.lastName1 && <label className="label"><span className="label-text-alt text-error w-full">{errors.lastName1}</span></label>}
          </div>
          <div className="form-control">
            <label className="label pb-2"><span className="label-text w-full">{t('lastName2')} *</span></label>
            <input 
              type="text" 
              name="lastName2" 
              value={formData.lastName2} 
              onChange={handleChange} 
              className={`input input-bordered w-full ${errors.lastName2 ? 'input-error' : ''}`} 
              required 
            />
            {errors.lastName2 && <label className="label"><span className="label-text-alt text-error w-full">{errors.lastName2}</span></label>}
          </div>
          <div className="form-control">
            <label className="label pb-2"><span className="label-text w-full">{t('idDocument')} *</span></label>
            <input 
              type="text" 
              name="idDocument" 
              value={formData.idDocument} 
              onChange={handleChange} 
              className={`input input-bordered w-full ${errors.idDocument ? 'input-error' : ''}`} 
              required 
            />
            {errors.idDocument && <label className="label"><span className="label-text-alt text-error w-full">{errors.idDocument}</span></label>}
          </div>
        </div>
      </div>

      {/* Dirección */}
      <div className="bg-base-200 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">{t('addressInfo')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control md:col-span-2">
            <label className="label pb-2"><span className="label-text w-full">{t('street')} *</span></label>
            <input 
              type="text" 
              name="street" 
              value={formData.street} 
              onChange={handleChange} 
              className={`input input-bordered w-full ${errors.street ? 'input-error' : ''}`} 
              required 
            />
            {errors.street && <label className="label"><span className="label-text-alt text-error w-full">{errors.street}</span></label>}
          </div>
          <div className="form-control">
            <label className="label pb-2"><span className="label-text w-full">{t('postalCode')} *</span></label>
            <input 
              type="text" 
              name="postalCode" 
              value={formData.postalCode} 
              onChange={handleChange} 
              className={`input input-bordered w-full ${errors.postalCode ? 'input-error' : ''}`} 
              required 
            />
            {errors.postalCode && <label className="label"><span className="label-text-alt text-error w-full">{errors.postalCode}</span></label>}
          </div>
          <div className="form-control">
            <label className="label pb-2"><span className="label-text w-full">{t('city')} *</span></label>
            <input 
              type="text" 
              name="city" 
              value={formData.city} 
              onChange={handleChange} 
              className={`input input-bordered w-full ${errors.city ? 'input-error' : ''}`} 
              required 
            />
            {errors.city && <label className="label"><span className="label-text-alt text-error w-full">{errors.city}</span></label>}
          </div>
          <div className="form-control md:col-span-2">
            <label className="label pb-2"><span className="label-text w-full">{t('province')} *</span></label>
            <input 
              type="text" 
              name="province" 
              value={formData.province} 
              onChange={handleChange} 
              className={`input input-bordered w-full ${errors.province ? 'input-error' : ''}`} 
              required 
            />
            {errors.province && <label className="label"><span className="label-text-alt text-error w-full">{errors.province}</span></label>}
          </div>
        </div>
      </div>

      {/* Contacto */}
      <div className="bg-base-200 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">{t('contactInfo')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label pb-2"><span className="label-text w-full">{t('email')} *</span></label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`} 
              required 
            />
            {errors.email && <label className="label"><span className="label-text-alt text-error w-full">{errors.email}</span></label>}
          </div>
          <div className="form-control">
            <label className="label pb-2"><span className="label-text w-full">{t('phone')} *</span></label>
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              className={`input input-bordered w-full ${errors.phone ? 'input-error' : ''}`} 
              required 
            />
            {errors.phone && <label className="label"><span className="label-text-alt text-error w-full">{errors.phone}</span></label>}
          </div>
        </div>
      </div>

      {/* Perro a apadrinar - Solo visible en modo padrino */}
      {sponsorMode === 'padrino' && (
        <div className="bg-base-200 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">{t('dogInfo')}</h3>
          <div className="form-control">
            <label className="label pb-2"><span className="label-text w-full">{t('dogName')}</span></label>
            <input 
              type="text" 
              name="dogName" 
              value={formData.dogName} 
              onChange={handleChange} 
              placeholder={t('dogNamePlaceholder')}
              className="input input-bordered w-full" 
            />
            <label className="label"><span className="label-text-alt">{t('dogNameHint')}</span></label>
          </div>
        </div>
      )}

      {/* Cuota */}
      <div className="bg-base-200 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">{t('quotaInfo')}</h3>
        <div className="form-control">
          <label className="label pb-2"><span className="label-text w-full">{t('quota')} *</span></label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            {[10, 20, 25].map((amount) => (
              <label key={amount} className="flex items-center gap-2 cursor-pointer p-2 border border-base-300 rounded hover:bg-base-100">
                <input 
                  type="radio"
                  name="cuota"
                  value={amount}
                  checked={formData.cuota === amount}
                  onChange={handleChange}
                  className="radio"
                />
                <span>{amount}€</span>
              </label>
            ))}
          </div>
          <div className="form-control">
            <label className="label pb-2"><span className="label-text w-full">{t('quotaOther')}</span></label>
            <input 
              type="number" 
              name="cuota" 
              value={formData.cuota} 
              onChange={handleChange}
              min="10"
              className={`input input-bordered w-full ${errors.cuota ? 'input-error' : ''}`}
            />
            {errors.cuota && <label className="label"><span className="label-text-alt text-error w-full">{errors.cuota}</span></label>}
          </div>
        </div>

        {/* Frecuencia de pago */}
        <div className="form-control mt-4">
          <label className="label pb-2"><span className="label-text w-full">{t('feeFrequency')} *</span></label>
          <select 
            name="fee_frequency"
            value={formData.fee_frequency}
            onChange={handleChange}
            className={`select select-bordered w-full ${errors.fee_frequency ? 'select-error' : ''}`}
            required
          >
            <option value="monthly">{t('feeFrequencyMonthly')}</option>
            <option value="quarterly">{t('feeFrequencyQuarterly')}</option>
            <option value="semiannual">{t('feeFrequencySemiannual')}</option>
            <option value="annual">{t('feeFrequencyAnnual')}</option>
          </select>
          {errors.fee_frequency && <label className="label"><span className="label-text-alt text-error w-full">{errors.fee_frequency}</span></label>}
        </div>

        <div className="alert alert-info mt-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>{t('quotaNote')}</span>
        </div>
      </div>

      {/* Transferencia automática */}
      <div className="bg-base-200 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">{t('transferTitle')} *</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="radio" 
              name="transferencia_automatica"
              value="true"
              checked={formData.transferencia_automatica === true}
              onChange={handleChange}
              className="radio"
            />
            <span>{t('transferYes')}</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="radio" 
              name="transferencia_automatica"
              value="false"
              checked={formData.transferencia_automatica === false}
              onChange={handleChange}
              className="radio"
            />
            <span>{t('transferNo')}</span>
          </label>
        </div>
      </div>

      {/* Datos bancarios */}
      <div className="bg-base-200 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">{t('bankInfo')}</h3>
        <div className="form-control">
          <label className="label pb-2"><span className="label-text w-full">{t('iban')} *</span></label>
          <input 
            type="text" 
            name="iban" 
            value={formData.iban} 
            onChange={handleChange}
            placeholder="ES..."
            className={`input input-bordered w-full ${errors.iban ? 'input-error' : ''}`} 
            required 
          />
          {errors.iban && <label className="label"><span className="label-text-alt text-error w-full">{errors.iban}</span></label>}
          <label className="label"><span className="label-text-alt">{t('ibanHint')}</span></label>
        </div>
      </div>

      {/* Autorizaciones */}
      <div className="bg-base-200 p-6 rounded-lg space-y-4">
        <h3 className="text-xl font-bold">{t('authorization')}</h3>
        
        <div className="form-control">
          <label className="flex items-start gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              name="autorizacion_cargos"
              checked={formData.autorizacion_cargos}
              onChange={handleChange}
              className="checkbox checkbox-lg"
            />
            <span className="label-text text-sm">{t('authorizationText')} *</span>
          </label>
          {errors.autorizacion_cargos && <label className="label"><span className="label-text-alt text-error">{errors.autorizacion_cargos}</span></label>}
        </div>

        <div className="form-control">
          <label className="flex items-start gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              name="politica_privacidad"
              checked={formData.politica_privacidad}
              onChange={handleChange}
              className="checkbox checkbox-lg"
            />
            <span className="label-text text-sm">{t('privacyText')} *</span>
          </label>
          {errors.politica_privacidad && <label className="label"><span className="label-text-alt text-error">{errors.politica_privacidad}</span></label>}
        </div>
      </div>

      {/* Suscripción a boletín */}
      <div className="bg-base-200 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">{t('newsletterTitle')}</h3>
        <p className="text-sm mb-4">{t('newsletterDesc')}</p>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="radio" 
              name="suscripcion_boletin"
              value="true"
              checked={formData.suscripcion_boletin === true}
              onChange={handleChange}
              className="radio"
            />
            <span>{t('yes')}</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="radio" 
              name="suscripcion_boletin"
              value="false"
              checked={formData.suscripcion_boletin === false}
              onChange={handleChange}
              className="radio"
            />
            <span>{t('no')}</span>
          </label>
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
