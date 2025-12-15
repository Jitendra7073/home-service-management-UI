export interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: "Available" | "Busy" | "Off";
}

export interface ServiceData {
  id: string;
  name: string;
  description: string;
  durationInMinutes: number;
  price: number;
  currency: string;
  isActive: boolean;
  coverImage: string;
  images: string[];
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  reviews: Review[];
  teamMembers: TeamMember[];
}