import { createSupabaseClient } from '@/lib/supabase';
import type { Dog, DogStatus, Vaccine, Deworming, Photo } from '@/types/dog';

// Re-exportar los tipos para compatibilidad
export type { Dog, DogStatus, Vaccine, Deworming, Photo } from '@/types/dog';

export async function getDogs(status?: DogStatus | DogStatus[]): Promise<Dog[]> {
  try {
    const supabase = createSupabaseClient();
    
    // Seleccionar solo los campos no comentados en la interfaz Dog
    let query = supabase.from('dogs').select(
      'id, name, sex, breed, birth_date, entry_date, neutering_date, photos, status, web_description, tested_with_cats, is_invisible'
    );

    // Si especificas estado(s), filtra por eso
    if (status) {
      if (Array.isArray(status)) {
        query = query.in('status', status);
      } else {
        query = query.eq('status', status);
      }
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching dogs from Supabase:', error.message);
      return getExampleDogs();
    }
    console.log('Fetched dogs:', data);
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching dogs:', error);
    return getExampleDogs();
  }
}

function getExampleDogs(): Dog[] {
  return [
    {
      id: 'f6d09437-b208-4b79-8aa5-7232b13daecd',
      name: 'Luna example',
      sex: 'female',
      breed: 'Galgo',
      birth_date: '2024-01-31',
      entry_date: '2025-11-05',
      neutering_date: '2025-12-22',
      photos: [
        {
          url: 'https://mpnqfsnbbbamcgtajmqd.supabase.co/storage/v1/object/public/dog-photos/temp-1766422305130/1766422305130-yzi2sa.jpeg',
          is_primary: true,
          description: '',
        },
        {
          url: 'https://mpnqfsnbbbamcgtajmqd.supabase.co/storage/v1/object/public/dog-photos/temp-1766422305130/1766422305130-wsqpno.jpeg',
          is_primary: false,
          description: '',
        },
        {
          url: 'https://mpnqfsnbbbamcgtajmqd.supabase.co/storage/v1/object/public/dog-photos/temp-1766422305130/1766422305130-33epq.jpeg',
          is_primary: false,
          description: '',
        },
        {
          url: 'https://mpnqfsnbbbamcgtajmqd.supabase.co/storage/v1/object/public/dog-photos/temp-1766422305130/1766422305130-qm4kdc.jpeg',
          is_primary: false,
          description: '',
        },
      ],
      status: 'in_residence',
      web_description: 'lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      tested_with_cats: true,
      is_invisible: false,
    },
  ];
}

export async function getDogById(id: string): Promise<Dog | null> {
  try {
    const supabase = createSupabaseClient();

    // Seleccionar solo los campos no comentados en la interfaz Dog
    const { data, error } = await supabase
      .from('dogs')
      .select('id, name, sex, breed, birth_date, entry_date, neutering_date, photos, status, web_description, tested_with_cats, is_invisible')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching dog:', error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching dog:', error);
    return null;
  }
}
