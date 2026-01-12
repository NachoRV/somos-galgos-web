import { getPayload } from 'payload';
import config from '@payload-config';
import type { Dog as PayloadDog } from '@/payload-types';
import type { Dog, DogStatus, PhotoTransformed } from '@/types/dog';

// Re-exportar los tipos para compatibilidad
export type { Dog, DogStatus, Vaccine, Deworming, PhotoTransformed } from '@/types/dog';

/**
 * Get Payload CMS client instance
 */
async function getPayloadClient() {
  return await getPayload({ config });
}

/**
 * Convert Lexical richText to plain text
 * This function extracts text content from Lexical JSON structure
 */
function lexicalToText(richText: any): string {
  if (!richText || typeof richText !== 'object') return '';
  
  // If it's a Lexical JSON structure
  if (richText.root && richText.root.children) {
    const extractText = (node: any): string => {
      if (!node) return '';
      
      // If node has text property, return it
      if (node.text) return node.text;
      
      // If node has children, recursively extract text
      if (node.children && Array.isArray(node.children)) {
        return node.children.map(extractText).join('');
      }
      
      return '';
    };
    
    return richText.root.children.map(extractText).join('\n');
  }
  
  return '';
}

/**
 * Transform Payload CMS dog data to frontend Dog format
 */
function transformPayloadDog(payloadDog: PayloadDog): Dog {
  const photos: PhotoTransformed[] = (payloadDog.photos || [])
    .map((photo, index) => {
      // If image is a populated Media object
      if (typeof photo.image === 'object' && photo.image !== null) {
        return {
          url: photo.image.url || '',
          is_primary: photo.order === 0 || index === 0,
          description: photo.caption || '',
        };
      }
      // If image is just an ID (string), skip it
      return null;
    })
    .filter((p): p is PhotoTransformed => p !== null)
    .sort((a, b) => (a.is_primary ? -1 : 1));

  return {
    id: payloadDog.id,
    name: payloadDog.name,
    sex: payloadDog.sex,
    breed: payloadDog.breed || '',
    birth_date: payloadDog.birthDate || '',
    entry_date: payloadDog.entryDate,
    neutering_date: payloadDog.neuteringDate || '',
    photos,
    status: payloadDog.status,
    notes: payloadDog.notes || '',
    web_description: payloadDog.webDescription || null,
    tested_with_cats: payloadDog.testedWithCats || false,
    is_invisible: payloadDog.isInvisible || false,
  };
}

export async function getDogs(status?: DogStatus | DogStatus[]): Promise<Dog[]> {
  try {
    const payload = await getPayloadClient();
    
    const whereCondition: any = {};
    
    if (status) {
      whereCondition.status = Array.isArray(status) 
        ? { in: status }
        : { equals: status };
    }

    const { docs } = await payload.find({
      collection: 'dogs',
      where: whereCondition,
      depth: 2, // Populate Media relations
      limit: 1000,
    });

    return docs.map(transformPayloadDog);
  } catch (error) {
    console.error('Error fetching dogs from Payload:', error);
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
    const payload = await getPayloadClient();

    const dog = await payload.findByID({
      collection: 'dogs',
      id,
      depth: 2, // Populate Media relations
    });

    if (!dog) return null;

    return transformPayloadDog(dog);
  } catch (error) {
    console.error('Error fetching dog by ID:', error);
    return null;
  }
}
