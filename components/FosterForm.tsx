'use client';
import { FosterFormWizard } from './FosterFormWizard';

interface FosterFormProps {
  dogId?: string;
  dogName?: string;
}

export function FosterForm({ dogId, dogName }: FosterFormProps) {
  return <FosterFormWizard dogId={dogId} dogName={dogName} />;
}
