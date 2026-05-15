import { Attachment } from "@shared/types/attachment.js";
import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema({
  id: {
    // id gets removed later
    type: String,
    required: true,
    unique: true,
  },

  taskId: {
    type: String,
    required: true,
  },

  userId: {
    type: String,
    required: true,
  },

  fileName: {
    type: String,
  },

  url: {
    type: String,
  },
});

export const AttachmentModel = mongoose.model<Attachment>(
  "Attachment",
  attachmentSchema,
);
