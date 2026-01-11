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
