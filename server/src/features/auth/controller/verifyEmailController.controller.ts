import type { Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import { verifyEmail } from "@/features/verification-tokens/services/verifyEmail.service";
import { verificationTokenSchema } from "@/features/verification-tokens/validators/verifyEmailSchema";

export const verifyEmailController = async (req: Request, res: Response) => {
  const result = verificationTokenSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError("Invalid request body", 400);
  }

  await verifyEmail({ token: result.data.token });

  return res.status(200).json({ message: "Email verified successfully." });
};
