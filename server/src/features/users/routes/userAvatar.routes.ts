import { getAuthContext } from "@/features/auth/utils/getAuthContext.js";
import { AppError } from "@/utils/AppError.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import express from "express";
import multer from "multer";
import { uploadAvatar } from "@/features/users/services/uploadAvatar.service.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

router.patch(
  "/me/avatar",
  upload.single("avatar"),
  asyncHandler(async (req, res) => {
    const avatarFile = req.file;

    if (!avatarFile) {
      throw new AppError("No file uploaded", 400);
    }

    const { userId, workspaceId } = getAuthContext(req);

    const uploadedAvatar = await uploadAvatar({ userId, workspaceId, avatarFile });

    return res.status(200).json({ uploadedAvatar });
  }),
);

export default router;
