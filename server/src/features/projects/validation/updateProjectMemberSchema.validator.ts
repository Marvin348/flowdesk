import { objectIdSchema } from "@/shared/validators/objectId.validator.js";
import z from "zod";

export const updateProjectMembersParamsSchema = z.object({
  projectId: objectIdSchema,
});

export type UpdateProjectMembersParams = z.infer<
  typeof updateProjectMembersParamsSchema
>;

export const updateProjectMembersBodySchema = z.object({
  userIdsToAdd: z.array(objectIdSchema).min(1),
});

export type UpdateProjectMembersBody = z.infer<
  typeof updateProjectMembersBodySchema
>;
