'use client';
import { sendFosterEmail } from '@/lib/actions/sendFosterEmail';
import { useApplicationForm } from '@/hooks/useApplicationForm';
import { BaseApplicationForm } from './BaseApplicationForm';

interface FosterFormProps {
  dogId?: string;
  dogName?: string;
}

export function FosterForm({ dogId, dogName }: FosterFormProps) {
  const formState = useApplicationForm({
    dogId,
    dogName,
    onSubmit: sendFosterEmail,
  });

  return (
    <BaseApplicationForm
      {...formState}
      translationNamespace="Foster"
    />
  );
}
