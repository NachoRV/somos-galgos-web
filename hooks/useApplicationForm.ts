import { useState } from 'react';
import { adoptionSchema, type AdoptionFormData } from '@/lib/validations/adoption';

interface UseApplicationFormProps {
  dogId?: string;
  dogName?: string;
  onSubmit: (data: AdoptionFormData) => Promise<{ success?: boolean; error?: any }>;
}

export function useApplicationForm({ dogId, dogName, onSubmit }: UseApplicationFormProps) {
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
      adoptionSchema.parse(formData);
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

  return {
    formData,
    errors,
    isSubmitting,
    submitStatus,
    handleChange,
    handleSubmit,
  };
}
