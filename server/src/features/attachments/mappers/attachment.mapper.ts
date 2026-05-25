import type { Attachment } from "@shared/types/attachment.js";
import type { AttachmentDocument } from "@/features/attachments/types/attachment.document.js";

const toIsoString = (value: string | Date | undefined): string => {
  if (!value) return "";

  return value instanceof Date ? value.toISOString() : value;
};

export const toAttachmentDto = (attachment: AttachmentDocument): Attachment => {
  return {
    id: attachment._id.toString(),
    projectId: attachment.projectId,
    taskId: attachment.taskId,
    userId: attachment.userId,
    fileName: attachment.fileName,
    fileUrl: attachment.fileUrl,
    mimeType: attachment.mimeType,
    fileSize: attachment.fileSize,
    createdAt: toIsoString(attachment.createdAt),
  };
};

export const toAttachmentDtos = (
  attachments: AttachmentDocument[],
): Attachment[] => {
  return attachments.map(toAttachmentDto);
};
