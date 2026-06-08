import mongoose from "mongoose";
import { AttachmentDocument } from "@/features/attachments/types/attachment.document.js";

const attachmentSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
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
  },
  {
    timestamps: true,
  },
);

export const AttachmentModel = mongoose.model<AttachmentDocument>(
  "Attachment",
  attachmentSchema,
);
