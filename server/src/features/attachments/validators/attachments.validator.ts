import z from "zod";
import mongoose from "mongoose";
import {
  DEFAULT_PAGE,
  MAX_PAGE_LIMIT,
  PAGE_LIMITS,
} from "@shared/constants/pagination";

export const attachmentsQuerySchema = z.object({
  search: z.string().trim().optional().default(""),
  page: z.coerce.number().int().positive().optional().default(DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(MAX_PAGE_LIMIT)
    .optional()
    .default(PAGE_LIMITS.attachments),
});

export type AttachmentsQueryParams = z.infer<typeof attachmentsQuerySchema>;

export const attachmentsProjectIdSchema = z.object({
  projectId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid userId",
  }),
});

export type AttachmentsProjectIdParams = z.infer<
  typeof attachmentsProjectIdSchema
>;
