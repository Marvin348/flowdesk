import z from "zod";

export const acceptInviteSchema = z.object({
  name: z.string().min(2, "Name ist zu kurz"),
  password: z.string().min(8, "Passwort muss mindestens 8 Zeichen haben"),
});

export type AcceptInviteFields = z.infer<typeof acceptInviteSchema>;
