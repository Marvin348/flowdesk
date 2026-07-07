import express from "express";
import { AttachmentModel } from "@/features/attachments/models/attachment.model.js";
import { getAuthContext } from "@/features/auth/utils/getAuthContext.js";
import { createSignedDownloadUrl } from "@/lib/storage/r2Storage.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { AppError } from "@/utils/AppError.js";
import mongoose from "mongoose";

const router = express.Router();

router.get<{ attachmentId: string }>(
  "/:attachmentId/download",
  asyncHandler(async (req, res) => {
    const { attachmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(attachmentId)) {
      throw new AppError("Invalid attachmentId", 400);
    }

    const { workspaceId } = getAuthContext(req);

    const attachment = await AttachmentModel.findOne({
      _id: attachmentId,
      workspaceId,
    }).lean();

    if (!attachment) {
      throw new AppError("Attachment not found", 404);
    }

    const signedUrl = await createSignedDownloadUrl(attachment.storageKey);

    return res.redirect(signedUrl);
  }),
);

export default router;
