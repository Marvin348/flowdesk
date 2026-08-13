import type { Request, Response } from "express";
import { passwordSchema } from "@/features/auth/validators/auth.validators";
import { AppError } from "@/utils/AppError";
import { getAuthContext } from "@/features/auth/utils/getAuthContext";
import { requestPasswordChange } from "@/features/auth/services/requestPasswordChange.service";

export const changePasswordController = async (req: Request, res: Response) => {
  const result = passwordSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError("Invalid request body", 400);
  }

  const input = result.data;

  const { userId, workspaceId } = getAuthContext(req);

  await requestPasswordChange({ input, userId, workspaceId });

  return res
    .status(200)
    .json({ message: "Password change verification email sent" });
};
