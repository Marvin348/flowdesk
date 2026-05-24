import express from "express";
import { AttachmentModel } from "@/features/attachments/models/attachment.model.js";
import { toAttachmentDto } from "@/features/attachments/mappers/attachment.mapper.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const attachments = await AttachmentModel.find().lean();
  res.json({ data: attachments.map(toAttachmentDto) });
});

export default router;
