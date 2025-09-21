// lib/definitions.ts
import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(3, { message: "Password must be at least 8 characters long" }),
});

export type LoginFormData = z.infer<typeof LoginFormSchema>;
