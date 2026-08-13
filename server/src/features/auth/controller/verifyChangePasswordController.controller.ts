import type { Request, Response } from "express";
import { verificationTokenSchema } from "@/features/verification-tokens/validators/verifyEmailSchema";
import { AppError } from "@/utils/AppError";
import { getAuthContext } from "@/features/auth/utils/getAuthContext";
import { verifyPasswordChange } from "@/features/auth/services/verifyPasswordChange.service";

export const verifyChangePasswordController = async (
  req: Request,
  res: Response,
) => {
  const result = verificationTokenSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError("Invalid token", 400);
  }

  const { userId, workspaceId } = getAuthContext(req);

  await verifyPasswordChange({
    userId,
    workspaceId,
    token: result.data.token,
  });

  return res.status(200).json({ message: "Password successfully changed" });
};
