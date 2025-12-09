import { z } from "zod";

export const addressSchema = z.object({
  street: z.string().min(3, "Street is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(6, "Postal Code is required"),
  country: z.string().min(2, "Country is required"),
});
