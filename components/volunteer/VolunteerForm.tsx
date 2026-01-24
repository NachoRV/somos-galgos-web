'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { FieldValues, SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { volunteerSchema, type VolunteerFormData } from '@/lib/validations/volunteer';

interface VolunteerFormProps {
  locale: string;
}

export default function VolunteerForm({ locale }: VolunteerFormProps) {
  const t = useTranslations('Volunteer');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerSchema),
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('[Form] Enviando datos:', data);
      
      // Crear timeout para el fetch
      const controller = new AbortController();
      const timeout = setTimeout(() => {
        console.error('[Form] Fetch timeout después de 15s');
        controller.abort();
      }, 15000); // 15 segundo timeout

      const response = await fetch('/api/submit-volunteer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': locale,
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeout);
      console.log('[Form] Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('[Form] API error:', errorData);
        throw new Error(errorData.message || 'Failed to submit volunteer application');
      }

      const result = await response.json();
      console.log('[Form] Success response:', result);

      setSuccess(true);
      reset();

      // Redirect after 2 seconds
      setTimeout(() => {
        console.log('[Form] Redirecting to home...');
        router.push(`/${locale}`);
      }, 2000);
    } catch (err) {
      console.error('[Form] Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="alert alert-success">
        <div>
          <span>{t('form.success')}</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="alert alert-error">
          <div>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Full Name */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-semibold">
            {t('form.fullName')} *
          </span>
        </label>
        <input
          {...register('fullName')}
          type="text"
          placeholder={t('form.fullNamePlaceholder')}
          className={`input input-bordered w-full ${
            errors.fullName ? 'input-error' : ''
          }`}
        />
        {errors.fullName && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.fullName.message as string}
            </span>
          </label>
        )}
      </div>

      {/* DNI */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-semibold">
            {t('form.dni')} *
          </span>
        </label>
        <input
          {...register('dni')}
          type="text"
          placeholder={t('form.dniPlaceholder')}
          className={`input input-bordered w-full ${
            errors.dni ? 'input-error' : ''
          }`}
        />
        {errors.dni && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.dni.message as string}
            </span>
          </label>
        )}
      </div>

      {/* Birth Date */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-semibold">
            {t('form.birthDate')} *
          </span>
        </label>
        <input
          {...register('birthDate')}
          type="date"
          className={`input input-bordered w-full ${
            errors.birthDate ? 'input-error' : ''
          }`}
        />
        {errors.birthDate && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.birthDate.message as string}
            </span>
          </label>
        )}
      </div>

      {/* Residence Location */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-semibold">
            {t('form.residenceLocation')} *
          </span>
        </label>
        <input
          {...register('residenceLocation')}
          type="text"
          placeholder={t('form.residenceLocationPlaceholder')}
          className={`input input-bordered w-full ${
            errors.residenceLocation ? 'input-error' : ''
          }`}
        />
        {errors.residenceLocation && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.residenceLocation.message as string}
            </span>
          </label>
        )}
      </div>

      {/* Phone */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-semibold">
            {t('form.phone')} *
          </span>
        </label>
        <input
          {...register('phone')}
          type="tel"
          placeholder={t('form.phonePlaceholder')}
          className={`input input-bordered w-full ${
            errors.phone ? 'input-error' : ''
          }`}
        />
        {errors.phone && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.phone.message as string}
            </span>
          </label>
        )}
      </div>

      {/* Driving License */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-semibold">
            {t('form.drivingLicense')} *
          </span>
        </label>
        <select
          {...register('drivingLicense')}
          defaultValue=""
          className={`select select-bordered w-full ${
            errors.drivingLicense ? 'select-error' : ''
          }`}
        >
          <option value="" disabled>{t('form.drivingLicenseSelect')}</option>
          <option value="si_carnet">{t('form.drivingLicenseYes')}</option>
          <option value="si_carnet_coche">{t('form.drivingLicenseYesWithCar')}</option>
          <option value="no_carnet">{t('form.drivingLicenseNo')}</option>
        </select>
        {errors.drivingLicense && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.drivingLicense.message as string}
            </span>
          </label>
        )}
      </div>

      {/* Submit Button */}
      <div className="form-control pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full"
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-sm" />
              {t('form.submitting')}
            </>
          ) : (
            t('form.submit')
          )}
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        {t('form.required')}
      </p>

      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && error && (
        <div className="mt-4 p-4 bg-gray-100 rounded text-xs font-mono overflow-auto max-h-40">
          <p className="font-bold">Debug Error:</p>
          <p>{error}</p>
        </div>
      )}
    </form>
  );
}
