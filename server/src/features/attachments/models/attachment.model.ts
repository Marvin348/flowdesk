import mongoose from "mongoose";
import { AttachmentDocument } from "@/features/attachments/types/attachment.document";

const attachmentSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    storageKey: {
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
