import z from "zod";

export const userNotificationSettingsSchema = z
  .object({
    assignments: z.boolean().optional(),
    comments: z.boolean().optional(),
    deadlines: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export type UserNotificationSettingsParams = z.infer<
  typeof userNotificationSettingsSchema
>;
