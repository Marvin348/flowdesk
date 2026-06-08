import express from "express";
import { AttachmentModel } from "@/features/attachments/models/attachment.model.js";
import { toAttachmentDto } from "@/features/attachments/mappers/attachment.mapper.js";
import { requireAuth } from "@/features/auth/middleware/requireAuth.js";
import { getAuthContext } from "@/features/auth/utils/getAuthContext.js";

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

export default router;
