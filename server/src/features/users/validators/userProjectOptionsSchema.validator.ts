import z from "zod";

export const userProjectOptionsQuery = z.object({
  search: z.string().trim().optional().default(""),
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid userId"),
});

export type UserProjectOptionsQuery = z.infer<typeof userProjectOptionsQuery>;
