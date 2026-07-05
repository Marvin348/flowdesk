import {
  APPEARANCE_THEMES,
  APPEARANCE_DENSITIES,
  APPEARANCE_START_VIEWS,
} from "@shared/types/user.js";
import { z } from "zod";

export const updateCurrentUserSchema = z
  .object({
    name: z.string().trim().min(2).max(20).optional(),
    jobTitle: z.string().trim().max(30).optional().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export type UpdateCurrentUserInput = z.infer<typeof updateCurrentUserSchema>;

export const appearanceSettingsSchema = z
  .object({
    theme: z.enum(APPEARANCE_THEMES).optional(),
    density: z.enum(APPEARANCE_DENSITIES).optional(),
    startView: z.enum(APPEARANCE_START_VIEWS).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export type AppearanceSettingsInput = z.infer<typeof appearanceSettingsSchema>;

export const changeEmailSchema = z.object({
  email: z.string().trim().email(),
});

export type ChangeEmailParams = z.infer<typeof changeEmailSchema>;
