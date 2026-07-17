import { objectIdSchema } from "@/shared/validators/objectId.validator";
import z from "zod";

export const createCommentBodySchema = z.object({
  taskId: objectIdSchema,
  message: z.string(),
  parentCommentId: objectIdSchema.optional(),
});

export type CreateCommentBody = z.infer<typeof createCommentBodySchema>;
