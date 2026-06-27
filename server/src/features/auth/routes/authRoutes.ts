import express from "express";
import {
  loginSchema,
  passwordSchema,
  registerSchema,
} from "@/features/auth/validators/auth.validators.js";
import {
  changePassword,
  loginUser,
  registerUser,
} from "@/features/auth/services/auth.service.js";
import { UserModel } from "@/features/users/models/user.modal.js";
import { toAuthUserDto } from "@/features/users/mappers/user.mapper.js";
import { requireAuth } from "@/features/auth/middleware/requireAuth.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { AppError } from "@/utils/AppError.js";
import { getAuthContext } from "@/features/auth/utils/getAuthContext.js";
import {
  resendEmailVerificationSchema,
  verifyEmailSchema,
} from "@/features/verification-tokens/validators/verifyEmailSchema.js";
import { verifyEmail } from "@/features/verification-tokens/services/verifyEmail.service.js";
import { resendVerificationEmail } from "@/features/verification-tokens/services/resendVerificationEmail.service.js";

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

    const { user, accessToken } = await loginUser(input);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    });

    return res.status(200).json({ user });
  }),
);

router.post("/logout", (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

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
    const result = verifyEmailSchema.safeParse(req.body);

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

    return res
      .status(200)
      .json({ message: "If an account exists, a new verification email has been sent." });
  }),
);

router.patch(
  "/password",
  requireAuth,
  asyncHandler(async (req, res) => {
    const result = passwordSchema.safeParse(req.body);

    if (!result.success) {
      throw new AppError("Invalid request body", 400);
    }

    const input = result.data;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Not authenticated", 401);
    }

    await changePassword(input, userId);

    return res.status(200).json({ message: "Password updated successfully" });
  }),
);

export default router;
