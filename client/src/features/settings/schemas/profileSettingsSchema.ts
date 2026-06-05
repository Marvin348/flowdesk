import z from "zod";

export const profileSettingsSchema = z.object({
  avatarKey: z.string(), // ??
  name: z.string().min(3, "Name eingeben"),
  email: z.string().min(8, "Mindestens 8 Zeichen"),
  jobTitle: z.string().min(3, "Mindestens 3 Zeichen").optional(),
});

export type ProfileSettingsFields = z.infer<typeof profileSettingsSchema>;
