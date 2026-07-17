import {
  DEFAULT_PAGE,
  MAX_PAGE_LIMIT,
  PAGE_LIMITS,
} from "@shared/constants/pagination";
import {
  TEAM_SORT_VALUES,
  TEAM_PROGRESS_VALUES,
  TEAM_ACTIVITY_VALUES,
} from "@shared/types/teamFilter/teamFilter";
import { USER_ROLE } from "@shared/types/user";
import z from "zod";

export const teamMembersQuerySchema = z.object({
  search: z.string().trim().optional().default(""),

  role: z.enum(USER_ROLE).optional(),

  sort: z.enum(TEAM_SORT_VALUES).optional(),

  progress: z.enum(TEAM_PROGRESS_VALUES).optional(),

  activity: z.enum(TEAM_ACTIVITY_VALUES).optional(),

  page: z.coerce.number().int().positive().optional().default(DEFAULT_PAGE),

  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(MAX_PAGE_LIMIT)
    .optional()
    .default(PAGE_LIMITS.team),
});

export type TeamMembersQueryParams = z.infer<typeof teamMembersQuerySchema>;
