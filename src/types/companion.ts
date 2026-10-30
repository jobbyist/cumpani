export interface CompanionProfile {
  id: string;
  name: string;
  username: string;
  age: number;
  city: string;
  province: string;
  bio: string;
  profileImage: string;
  /** tiny pre-blurred image shown to logged-out visitors (original is never sent to them) */
  blurImage?: string;
  images: string[];
  availability: string;
  isAvailable?: boolean;
  /** true for fictional seed/demo profiles; the UI labels these as samples */
  isSample?: boolean;
  /** self-declared category for the viewer's orientation filter; undefined = shown to everyone */
  presentsAs?: 'women' | 'men' | 'trans';
  orientationTags?: string[];
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



