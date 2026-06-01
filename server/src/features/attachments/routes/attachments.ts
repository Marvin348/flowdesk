import express from "express";
import { AttachmentModel } from "@/features/attachments/models/attachment.model.js";
import { toAttachmentDto } from "@/features/attachments/mappers/attachment.mapper.js";
import { requireAuth } from "@/features/auth/middleware/requireAuth.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
  const attachments = await AttachmentModel.find().lean();
  res.json({ data: attachments.map(toAttachmentDto) });
});

export default router;
