import type { Attachment } from "@shared/types/attachment.js";

type AttachmentDbRecord = Omit<Attachment, "id" | "createdAt"> & {
  _id: { toString: () => string };
  __v?: number;
  createdAt: string | Date;
};

const toIsoString = (value: string | Date | undefined): string => {
  if (!value) return "";

  return value instanceof Date ? value.toISOString() : value;
};

export const toAttachmentDto = (attachment: AttachmentDbRecord): Attachment => {
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
  attachments: AttachmentDbRecord[],
): Attachment[] => {
  return attachments.map(toAttachmentDto);
};
