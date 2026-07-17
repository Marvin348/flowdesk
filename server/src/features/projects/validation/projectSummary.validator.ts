import { PRIORITY } from "@shared/types/priority";
import { STATUSBASE } from "@shared/types/StatusBase";
import {
  DEFAULT_PAGE,
  MAX_PAGE_LIMIT,
  PAGE_LIMITS,
} from "@shared/constants/pagination";
import z from "zod";

export const projectSummaryQuerySchema = z.object({
  search: z.string().trim().optional().default(""),

  priority: z.enum(PRIORITY).optional(),

  status: z.enum(STATUSBASE).optional(),

  hasAttachments: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => {
      if (value === undefined) return undefined;
      return value === "true";
    }),

  page: z.coerce.number().int().positive().optional().default(DEFAULT_PAGE),

  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(MAX_PAGE_LIMIT)
    .optional()
    .default(PAGE_LIMITS.summary),
});

export type ProjectSummaryQueryParams = z.infer<
  typeof projectSummaryQuerySchema
>;
