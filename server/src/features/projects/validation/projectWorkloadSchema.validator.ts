import z from "zod";
import {
  DEFAULT_PAGE,
  MAX_PAGE_LIMIT,
  PAGE_LIMITS,
} from "@shared/constants/pagination.js";
import { PROJECT_WORKLOAD_SORT } from "@shared/types/sort/projectWorkloadSort.js";

export const projectWorkloadQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(MAX_PAGE_LIMIT)
    .optional()
    .default(PAGE_LIMITS.workload),

  workloadSort: z.enum(PROJECT_WORKLOAD_SORT).optional(),
});

export type ProjectWorkloadQuery = z.infer<typeof projectWorkloadQuerySchema>;
