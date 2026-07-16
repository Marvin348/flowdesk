import z from "zod";
import { PRIORITY } from "@shared/types/priority.js";
import { STATUSBASE } from "@shared/types/StatusBase.js";
import { objectIdSchema } from "@/shared/validators/objectId.validator.js";

export const createProjectSchema = z.object({
  title: z.string().min(3, "Title is required"),
  dueDate: z.string().min(1, "Select Deadline"),
  projectStatus: z.enum(STATUSBASE),
  priority: z.enum(PRIORITY),
  invitedUserIds: z.array(z.string()).min(1, "Select collaborators"),
  description: z.string().optional(),
});

export type CreateProjectParams = z.infer<typeof createProjectSchema>;

export const projectDetailsParamsSchema = z.object({
  projectId: objectIdSchema,
});

export type ProjectDetailsParams = z.infer<typeof projectDetailsParamsSchema>;
