import express from "express";
import { AttachmentModel } from "@/features/attachments/models/attachment.model.js";
import { toAttachmentDto } from "@/features/attachments/mappers/attachment.mapper.js";
import { getAuthContext } from "@/features/auth/utils/getAuthContext.js";
import { createSignedDownloadUrl } from "@/features/attachments/services/attachmentStorage.service.js";
import { asyncHandler } from "@/utils/asyncHandler.js";
import { AppError } from "@/utils/AppError.js";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { workspaceId } = getAuthContext(req);

    const attachmentRecords = await AttachmentModel.find({
      workspaceId,
    }).lean();

    return res.json({ data: attachmentRecords.map(toAttachmentDto) });
  }),
);

router.get(
  "/:attachmentId/download",
  asyncHandler(async (req, res) => {
    const { attachmentId } = req.params;
    const { workspaceId } = getAuthContext(req);

    if (!attachmentId) {
      throw new AppError("Invalid AttachmentId", 400);
    }

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
