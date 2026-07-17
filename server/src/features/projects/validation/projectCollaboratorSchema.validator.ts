import {
  DEFAULT_PAGE,
  MAX_PAGE_LIMIT,
  PAGE_LIMITS,
} from "@shared/constants/pagination";
import { PROJECT_COLLABORATOR_SORT } from "@shared/types/sort/projectCollaboratorSort";
import z from "zod";

export const projectCollaboratorQuerySchema = z.object({
  collaboratorsSort: z.enum(PROJECT_COLLABORATOR_SORT).optional(),
  page: z.coerce.number().int().positive().optional().default(DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(MAX_PAGE_LIMIT)
    .optional()
    .default(PAGE_LIMITS.collaborators),
});

export type ProjectCollaboratorQuery = z.infer<
  typeof projectCollaboratorQuerySchema
>;
