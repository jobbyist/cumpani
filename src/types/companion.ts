export interface CompanionProfile {
  id: string;
  name: string;
  age: number;
  city: string;
  province: string;
  bio: string;
  profileImage: string;
  images: string[];
  rate: number;
  availability: string;
  // Contact details - only visible to paid users
  phone?: string;
  email?: string;
  location?: string;
  rating: number;
  reviewCount: number;
  // Additional filter fields
  ethnicity?: string;
  gender?: string;
  sexualOrientation?: string;
  isAvailable?: boolean;
}

export interface Booking {
  id: string;
  companionId: string;
  userId: string;
  date: string;
  duration: number;
  totalCost: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export const SOUTH_AFRICAN_CITIES = [
  'Johannesburg',
  'Cape Town',
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

export const ETHNICITIES = [
  'Black',
  'White',
  'Coloured',
  'Indian',
  'Asian',
  'Mixed',
  'Other',
];

export const GENDERS = [
  'Female',
  'Male',
  'Non-binary',
  'Other',
];

export const SEXUAL_ORIENTATIONS = [
  'Straight',
  'Gay',
  'Lesbian',
  'Bisexual',
  'Pansexual',
  'Other',
];
