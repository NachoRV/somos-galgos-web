import { useState } from 'react';
import { sponsorshipSchema, type SponsorshipFormData } from '@/lib/validations/sponsorship';

interface UseSponsorshipFormProps {
  dogId?: string;
  dogName?: string;
  sponsorMode?: 'padrino' | 'socio';
  onSubmit: (data: SponsorshipFormData) => Promise<{ success?: boolean; error?: any }>;
}

export function useSponsorshipForm({ dogId, dogName, sponsorMode = 'padrino', onSubmit }: UseSponsorshipFormProps) {
  const [formData, setFormData] = useState<SponsorshipFormData>({
    firstName: '',
    lastName1: '',
    lastName2: '',
    idDocument: '',
    street: '',
    city: '',
    postalCode: '',
    province: '',
    email: '',
    phone: '',
    dogName: dogName || '',
    dogId: dogId || '',
    cuota: 10,
    fee_frequency: 'monthly' as 'monthly' | 'quarterly' | 'semiannual' | 'annual',
    iban: '',
    transferencia_automatica: false,
    suscripcion_boletin: false,
    autorizacion_cargos: false,
    politica_privacidad: false,
    sponsor_mode: sponsorMode,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let val: any;
    
    if (type === 'checkbox') {
      val = (e.target as HTMLInputElement).checked;
    } else if (type === 'radio') {
      // Para radio buttons de booleanos, convertir string a boolean
      if (value === 'true') {
        val = true;
      } else if (value === 'false') {
        val = false;
      } else {
        val = value;
      }
    } else {
      val = value;
    }
    
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'cuota' ? Number(val) : val 
    }));
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
      console.log('Form data before validation:', formData);
      sponsorshipSchema.parse(formData);
      console.log('Form data passed validation, calling onSubmit');
      const result = await onSubmit(formData);
      
      if (result.error) {
        setSubmitStatus('error');
        if (typeof result.error === 'object') {
          setErrors(result.error as Record<string, string>);
        }
      } else {
        setSubmitStatus('success');
        setFormData({
          firstName: '',
          lastName1: '',
          lastName2: '',
          idDocument: '',
          street: '',
          city: '',
          postalCode: '',
          province: '',
          email: '',
          phone: '',
          dogName: dogName || '',
          dogId: dogId || '',
          cuota: 10,
          fee_frequency: 'monthly' as 'monthly' | 'quarterly' | 'semiannual' | 'annual',
          iban: '',
          transferencia_automatica: false,
          suscripcion_boletin: false,
          autorizacion_cargos: false,
          politica_privacidad: false,
          sponsor_mode: sponsorMode,
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

  return {
    formData,
    errors,
    isSubmitting,
    submitStatus,
    handleChange,
    handleSubmit,
  };
}
