import { Attachment } from "@shared/types/attachment.js";
import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
  {
    id: {
      // id gets removed later
      type: String,
      required: true,
      unique: true,
    },

    projectId: {
      type: String,
      required: true,
    },

    taskId: {
      type: String,
      default: null,
    },

    userId: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    createdAt: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const AttachmentModel = mongoose.model<Attachment>(
  "Attachment",
  attachmentSchema,
);
