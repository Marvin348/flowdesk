import z from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name eingeben"),
  email: z.string().min(1, "Email eingeben").email("Gültige Email eingeben"),
  password: z.string().min(8, "Mindestens 8 Zeichen"),
});

export type RegisterFields = z.infer<typeof registerSchema>;