export interface ServiceFormData {
  name: string;
  description: string;
  durationInMinutes: number;
  price: number;
  totalBookingAllow:number;
  currency: string;
  isActive: boolean;
}

export type UploadedImage = {
  file?: File; // Keep reference for cleanup if needed
  preview: string;
  url?: string;
  publicId?: string;
  uploading: boolean;
  progress: number;
  error?: string;
};