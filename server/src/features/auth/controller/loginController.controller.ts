import type { Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import { loginUser } from "@/features/auth/services/auth.service";
import { loginSchema } from "@/features/auth/validators/auth.validators";
import { SESSION_TTL_SECONDS } from "@/features/sessions/constants/session.constants";
import { authCookieOptions } from "@/shared/config/auth-cookie";

export const loginController = async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError("Invalid request body", 400);
  }

  const userAgent = req.get("user-agent");
  const userIp = req.ip;

  const input = result.data;

  const { user, sessionId } = await loginUser({
    input,
    sessionMetadata: { userAgent, userIp },
  });

  res.cookie("sessionId", sessionId, {
    ...authCookieOptions,
    maxAge: SESSION_TTL_SECONDS * 1000,
  });

  return res.status(200).json({ user });
};
