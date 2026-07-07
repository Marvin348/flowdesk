import type { ProjectAttachmentDto } from "@shared/types/dto/projects/projectAttachments.dto.js";
import { Types } from "mongoose";
import { bulidPublicFileUrl } from "@/utils/bulidPublicFileUrl.js";
import { toIsoString } from "@/utils/toIsoString.js";

type ProjectAttachmentsAggregationResult = {
  _id: Types.ObjectId;
  projectId: Types.ObjectId;
  taskId?: Types.ObjectId | null;
  userId: Types.ObjectId;

  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  createdAt: Date;

  uploadedBy: {
    _id: Types.ObjectId;
    name: string;
    email: string;
    avatarKey?: string;
    avatarStorageKey?: string;
    avatarUrl?: string;
  };

  task?: {
    _id: Types.ObjectId;
    title: string;
  } | null;
};

export const toProjectAttachmentsDto = (
  attachments: ProjectAttachmentsAggregationResult,
): ProjectAttachmentDto => ({
  id: attachments._id.toString(),
  projectId: attachments.projectId.toString(),
  taskId: attachments.taskId ? attachments.taskId.toString() : null,
  userId: attachments.userId.toString(),

  fileName: attachments.fileName,
  fileUrl: attachments.fileUrl,
  mimeType: attachments.mimeType,
  fileSize: attachments.fileSize,

  uploadedAt: toIsoString(attachments.createdAt),

  task: attachments.task
    ? {
        id: attachments.task._id.toString(),
        title: attachments.task.title,
      }
    : null,

  uploadedBy: {
    id: attachments.uploadedBy._id.toString(),
    name: attachments.uploadedBy.name,
    email: attachments.uploadedBy.email,
    avatarKey: attachments.uploadedBy.avatarKey,
    avatarUrl: bulidPublicFileUrl(attachments.uploadedBy.avatarStorageKey),
  },
});
