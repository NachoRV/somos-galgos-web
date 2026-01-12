import type { Media } from '@/payload-types';

export interface Vaccine {
  date: string;
  name: string;
}

export interface Deworming {
  date: string;
  product: string;
}

// Photo structure used in frontend components (simplified with direct URL)
export interface PhotoTransformed {
  url: string;
  is_primary: boolean;
  description: string;
}

// Photo structure from Payload CMS (with Media relation)
export interface Photo {
  image: string | Media;
  caption?: string;
  order: number;
  id?: string;
}

export interface Dog {
  id: string;
  name: string;
  sex: 'male' | 'female';
  breed: string;
  birth_date: string;
  entry_date: string;
  neutering_date: string;
  photos: PhotoTransformed[];
  status: DogStatus;
  notes?: string;
  web_description: any; // Lexical richText object
  tested_with_cats: boolean;
  is_invisible: boolean;

}

export type DogStatus = 'in_residence' | 'fostered' | 'adopted' | 'in_treatment' | 'deceased' | 'lost' | 'available';
