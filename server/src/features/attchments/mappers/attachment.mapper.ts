import type { Attachment } from "@shared/types/attachment.js";

type AttachmentDbRecord = Attachment & {
  _id?: unknown;
  __v?: number;
};

export const toAttachmentDto = (attachment: AttachmentDbRecord): Attachment => {
  return {
    id: attachment.id,
    projectId: attachment.projectId,
    taskId: attachment.taskId,
    userId: attachment.userId,
    fileName: attachment.fileName,
    fileUrl: attachment.fileUrl,
    mimeType: attachment.mimeType,
    fileSize: attachment.fileSize,
    createdAt: attachment.createdAt,
  };
};

export const toAttachmentDtos = (
  attachments: AttachmentDbRecord[],
): Attachment[] => {
  return attachments.map(toAttachmentDto);
};
