import express from "express";
import { requireAuth } from "@/features/auth/middleware/requireAuth";
import { asyncHandler } from "@/utils/asyncHandler";
import { loginController } from "@/features/auth/controller/loginController.controller";
import { sessionsController } from "@/features/auth/controller/sessionsController.controller";
import { logoutController } from "@/features/auth/controller/logoutController.controller";
import { meController } from "@/features/auth/controller/meController.controller";
import { registerController } from "@/features/auth/controller/registerController.controller";
import { verifyEmailController } from "@/features/auth/controller/verifyEmailController.controller";
import { resendVerificationEmailController } from "@/features/auth/controller/resendVerificationEmailController.controller";
import { changePasswordController } from "@/features/auth/controller/changePasswordController.controller";
import { verifyChangePasswordController } from "@/features/auth/controller/verifyChangePasswordController.controller";

const router = express.Router();

router.get("/me", requireAuth, asyncHandler(meController));

router.post("/register", asyncHandler(registerController));

router.post("/login", asyncHandler(loginController));

router.get("/sessions", requireAuth, asyncHandler(sessionsController));

router.post("/logout", requireAuth, logoutController);

router.post("/verify-email", asyncHandler(verifyEmailController));

router.post(
  "/resend-verification-email",
  asyncHandler(resendVerificationEmailController),
);

router.post(
  "/password/change-request",
  requireAuth,
  asyncHandler(changePasswordController),
);

router.post(
  "/password/change/verify",
  requireAuth,
  asyncHandler(verifyChangePasswordController),
);

export default router;
