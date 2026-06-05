import z from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email eingeben").email("Gültige Email eingeben"),
  password: z.string().min(8, "Mindestens 8 Zeichen"),
});

export type LoginFields = z.infer<typeof loginSchema>;
