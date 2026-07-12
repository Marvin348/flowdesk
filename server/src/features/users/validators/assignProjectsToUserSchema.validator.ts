import z from "zod";

export const assignProjectsToUserSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid userId"),
  projectIdsToAdd: z
    .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid projectId"))
    .min(1),
});

export type AssignProjectsToUserInput = z.infer<
  typeof assignProjectsToUserSchema
>;
