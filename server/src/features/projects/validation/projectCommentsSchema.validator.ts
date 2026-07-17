import z from "zod";
import { PROJECT_COMMENTS_SORT } from "@shared/types/sort/projectCommentsSort";
import { MAX_PAGE_LIMIT } from "@shared/constants/pagination";

export const projectCommentsQuerySchema = z.object({
  commentsSort: z.enum(PROJECT_COMMENTS_SORT).optional(),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(MAX_PAGE_LIMIT)
    .optional()
    .default(8),
});

export type ProjectCommentsQuery = z.infer<typeof projectCommentsQuerySchema>;
