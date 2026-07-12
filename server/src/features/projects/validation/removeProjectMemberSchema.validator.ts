import { objectIdSchema } from "@/shared/validators/objectId.validator.js";
import z from "zod";

export const removeProjectMemberParamsSchema = z.object({
  projectId: objectIdSchema,
  userId: objectIdSchema,
});

export type RemoveProjectMemberParams = z.infer<
  typeof removeProjectMemberParamsSchema
>;
