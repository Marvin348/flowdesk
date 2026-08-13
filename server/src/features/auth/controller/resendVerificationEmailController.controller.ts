import type { Request, Response } from "express";
import { resendEmailVerificationSchema } from "@/features/verification-tokens/validators/verifyEmailSchema";
import { AppError } from "@/utils/AppError";
import { resendVerificationEmail } from "@/features/verification-tokens/services/resendVerificationEmail.service";

export const resendVerificationEmailController = async (
  req: Request,
  res: Response,
) => {
  const result = resendEmailVerificationSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError("Invalid email", 400);
  }

  await resendVerificationEmail({ email: result.data.email });

  return res.status(200).json({
    message: "If an account exists, a new verification email has been sent.",
  });
};
