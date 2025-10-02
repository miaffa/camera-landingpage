import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, "Full name is required").max(100, "Name must be less than 100 characters"),
  username: z.string().min(1, "Username is required").max(50, "Username must be less than 50 characters"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  location: z.string().max(100, "Location must be less than 100 characters").optional(),
  image: z.instanceof(File).optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
