import z from "zod";

export const inviteMemberSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email eingeben")
    .email("Gültige Email eingeben"),
});

export type InviteMemberFields = z.infer<typeof inviteMemberSchema>;