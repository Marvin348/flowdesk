import z from "zod";
import { PRIORITY } from "@shared/types/priority.js";
import { STATUSBASE } from "@shared/types/StatusBase.js";

export const createTaskSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  collaboratorIds: z
    .array(z.string())
    .min(1, "Select at least one collaborator"),
  dueDate: z.string().min(1, "Deadline is required"),
  tags: z
    .array(z.string().min(2, "Tags must be at least 2 characters"))
    .max(3, "A maximum of 3 tags is allowed")
    .optional(),
  taskPriority: z.enum(PRIORITY),
  reminderAt: z.string().optional(),
  description: z.string().optional(),
});

export type CreateTaskFields = z.infer<typeof createTaskSchema>;

export const taskStatusSchema = z.object({
  taskStatus: z.enum(STATUSBASE),
});

export type TaskStatusFields = z.infer<typeof taskStatusSchema>;
