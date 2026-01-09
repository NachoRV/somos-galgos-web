export interface Vaccine {
  date: string;
  name: string;
}

export interface Deworming {
  date: string;
  product: string;
}

export interface Photo {
  url: string;
  is_primary: boolean;
  description: string;
}

export interface Dog {
  id: string;
  name: string;
  // chip_number: string;
  sex: 'male' | 'female';
  breed: string;
  birth_date: string;
  entry_date: string;
  neutering_date: string;
  // origin: string;
  // vaccines: Vaccine[];
  // deworming: Deworming[];
  //vet_history_url: string;
  photos: Photo[];
  status: DogStatus;
  notes?: string;
  web_description: string;
  tested_with_cats: boolean;
  is_invisible: boolean;
  //created_at: string;
  //updated_at: string;
  //created_by: string | null;
  //updated_by: string | null;
}

export type DogStatus = 'in_residence' | 'fostered' | 'adopted' | 'in_treatment' | 'deceased' | 'lost' | 'available';
