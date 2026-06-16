import z from "zod";

export const createWorkspaceInviteSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export type CreateWorkspaceInviteInput = z.infer<
  typeof createWorkspaceInviteSchema
>;
