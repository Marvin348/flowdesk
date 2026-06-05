import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Min 8 signs"),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, "Min 8 signs"),
    newPassword: z.string().min(8, "Min 8 signs"),
    confirmPassword: z.string().min(8, "Min 8 signs"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password are not matching",
    path: ["confirmPassword"],
  });
export type PasswordInput = z.infer<typeof passwordSchema>;
