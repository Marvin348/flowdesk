import z from "zod";
import {
  MAX_PAGE_LIMIT,
  PROJECT_TASKS_LIMIT,
} from "@shared/constants/pagination";
import { STATUSBASE } from "@shared/types/StatusBase";

export const projectTasksQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int().positive()
    .max(MAX_PAGE_LIMIT)
    .default(PROJECT_TASKS_LIMIT),

  taskStatus: z.enum(STATUSBASE),
  offset: z.coerce.number().int().nonnegative().default(PROJECT_TASKS_LIMIT),
});

export type ProjectTasksQuery = z.infer<typeof projectTasksQuerySchema>;
