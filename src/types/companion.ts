export interface CompanionProfile {
  id: string;
  name: string;
  username: string;
  age: number;
  city: string;
  province: string;
  bio: string;
  profileImage: string;
  images: string[];
  availability: string;
  isAvailable?: boolean;
  /** true for fictional seed/demo profiles; the UI labels these as samples */
  isSample?: boolean;
}

export const SOUTH_AFRICAN_CITIES = [
  'Johannesburg',
  'Cape Town',
  'Stellenbosch',
  'Durban',
  'Pretoria',
  'Sandton',
  'Midrand',
  'Port Elizabeth',
  'Bloemfontein',
  'Polokwane',
  'Nelspruit',
  'Kimberley',
];



