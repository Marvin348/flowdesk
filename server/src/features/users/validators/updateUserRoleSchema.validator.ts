import z from "zod";
import mongoose from "mongoose";
import { USER_ROLE } from "@shared/types/user.js";

export const updateUserRoleParamsSchema = z.object({
  id: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid userId",
  }),
});

export type UpdateUserRoleParams = z.infer<typeof updateUserRoleParamsSchema>;

export const updateUserRoleBodySchema = z.object({
  role: z.enum(USER_ROLE),
});

export type UpdateUserRoleBodyParams = z.infer<typeof updateUserRoleBodySchema>;
