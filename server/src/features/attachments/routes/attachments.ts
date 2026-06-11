import express from "express";
import { AttachmentModel } from "@/features/attachments/models/attachment.model.js";
import { toAttachmentDto } from "@/features/attachments/mappers/attachment.mapper.js";
import { requireAuth } from "@/features/auth/middleware/requireAuth.js";
import { getAuthContext } from "@/features/auth/utils/getAuthContext.js";
import { createSignedDownloadUrl } from "@/features/attachments/services/attachmentStorage.service.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const { workspaceId } = getAuthContext(req);

    const attachmentRecords = await AttachmentModel.find({
      workspaceId,
    }).lean();

    return res.json({ data: attachmentRecords.map(toAttachmentDto) });
  } catch (error) {}
});

router.get("/:attachmentId/download", async (req, res) => {
  try {
    const { attachmentId } = req.params;
    const { workspaceId } = getAuthContext(req);

    const attachment = await AttachmentModel.findOne({
      _id: attachmentId,
      workspaceId,
    }).lean();

    if (!attachment) {
      return res.status(404).json({ error: "Attachment not found" });
    }

    const signedUrl = await createSignedDownloadUrl(attachment.storageKey);

    return res.redirect(signedUrl);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to open attachment",
    });
  }
});

export default router;
