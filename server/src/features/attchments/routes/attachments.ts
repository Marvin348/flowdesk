import express from "express";
import { AttachmentModel } from "../models/attachment.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const attachments = await AttachmentModel.find().lean();
  res.json({ data: attachments });
});

export default router;
