import z from "zod";

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, "Mindestens 8 Zeichen"),
    newPassword: z.string().min(8, "Mindestens 8 Zeichen"),
    confirmPassword: z.string().min(8, "Mindestens 8 Zeichen"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Die Passwörter stimmen nicht überein",
    path: ["confirmPassword"],
  });

export type PasswordFields = z.infer<typeof passwordSchema>;
