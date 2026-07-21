import z from "zod";
import { PRIORITY } from "@shared/types/Priority";

export const editTaskSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters").optional(),
    collaboratorIds: z
      .array(z.string())
      .min(1, "Select at least one collaborator")
      .optional(),
    dueDate: z.string().min(1, "Deadline is required").optional(),
    tags: z
      .array(z.string().min(2, "Tags must be at least 2 characters"))
      .max(3, "A maximum of 3 tags is allowed")
      .optional(),
    taskPriority: z.enum(PRIORITY).optional(),
    reminderAt: z.string().optional(),
    description: z.string().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export type EditTaskBodyParams = z.infer<typeof editTaskSchema>;
