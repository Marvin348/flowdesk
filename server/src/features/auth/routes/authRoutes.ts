import express from "express";
import {
  loginSchema,
  passwordSchema,
  registerSchema,
} from "@/features/auth/validators/auth.validators";
import { loginUser, registerUser } from "@/features/auth/services/auth.service";
import { requestPasswordChange } from "@/features/auth/services/requestPasswordChange.service";
import { UserModel } from "@/features/users/models/user.modal";
import { toAuthUserDto } from "@/features/users/mappers/user.mapper";
import { requireAuth } from "@/features/auth/middleware/requireAuth";
import { asyncHandler } from "@/utils/asyncHandler";
import { AppError } from "@/utils/AppError";
import { getAuthContext } from "@/features/auth/utils/getAuthContext";
import {
  resendEmailVerificationSchema,
  verificationTokenSchema,
} from "@/features/verification-tokens/validators/verifyEmailSchema";
import { verifyEmail } from "@/features/verification-tokens/services/verifyEmail.service";
import { resendVerificationEmail } from "@/features/verification-tokens/services/resendVerificationEmail.service";
import { verifyPasswordChange } from "@/features/auth/services/verifyPasswordChange.service";
import { authCookieOptions } from "@/shared/config/auth-cookie";
import { SESSION_TTL_SECONDS } from "@/features/sessions/constants/session.constants";
import { deleteSession } from "@/features/sessions/repository/session.repository";

const router = express.Router();

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId, workspaceId } = getAuthContext(req);

    const user = await UserModel.findOne({ _id: userId, workspaceId }).lean();

    if (!user) {
      throw new AppError("Not authenticated", 401);
    }

    return res.status(200).json({ user: toAuthUserDto(user) });
  }),
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      throw new AppError("Invalid request body", 400);
    }

    const input = result.data;

    const { user, sessionId } = await loginUser(input);

    res.cookie("sessionId", sessionId, {
      ...authCookieOptions,
      maxAge: SESSION_TTL_SECONDS * 1000,
    });

    return res.status(200).json({ user });
  }),
);

router.post("/logout", async (req, res) => {
  const sessionId = req.cookies.sessionId;

  if (sessionId) {
    await deleteSession(sessionId);
  }

  res.clearCookie("sessionId", authCookieOptions);

  return res.status(200).json({ message: "Logout successful" });
});

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      throw new AppError("Invalid request body", 400);
    }

    const input = result.data;

    await registerUser(input);

    return res
      .status(201)
      .json({ message: "Registration successful. Please check your email." });
  }),
);

router.post(
  "/verify-email",
  asyncHandler(async (req, res) => {
    const result = verificationTokenSchema.safeParse(req.body);

    if (!result.success) {
      throw new AppError("Invalid request body", 400);
    }

    await verifyEmail({ token: result.data.token });

    return res.status(200).json({ message: "Email verified successfully." });
  }),
);

router.post(
  "/resend-verification-email",
  asyncHandler(async (req, res) => {
    const result = resendEmailVerificationSchema.safeParse(req.body);

    if (!result.success) {
      throw new AppError("Invalid email", 400);
    }

    await resendVerificationEmail({ email: result.data.email });

    return res.status(200).json({
      message: "If an account exists, a new verification email has been sent.",
    });
  }),
);

router.post(
  "/password/change-request",
  requireAuth,
  asyncHandler(async (req, res) => {
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
  }),
);

router.post(
  "/password/change/verify",
  requireAuth,
  asyncHandler(async (req, res) => {
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
  }),
);

export default router;
