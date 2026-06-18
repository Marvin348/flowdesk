import z from "zod";

export const createWorkspaceInviteSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export type CreateWorkspaceInviteInput = z.infer<
  typeof createWorkspaceInviteSchema
>;

export const acceptWorkspaceInviteSchema = z.object({
  name: z.string().min(2, "Name to short"),
  password: z.string().min(8, "Min 8 signs"),
});

export type AcceptWorkspaceInviteInput = z.infer<
  typeof acceptWorkspaceInviteSchema>;
