'use client';
import { AdoptionFormWizard } from './AdoptionFormWizard';

interface AdoptionFormProps {
  dogId?: string;
  dogName?: string;
}

export function AdoptionForm({ dogId, dogName }: AdoptionFormProps) {
  return <AdoptionFormWizard dogId={dogId} dogName={dogName} />;
}
