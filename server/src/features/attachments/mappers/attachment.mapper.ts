import type { Attachment } from "@shared/types/attachment";
import type { AttachmentDocument } from "@/features/attachments/types/attachment.document";

const toIsoString = (value: string | Date | undefined): string => {
  if (!value) return "";

  return value instanceof Date ? value.toISOString() : value;
};

export const toAttachmentDto = (attachment: AttachmentDocument): Attachment => {
  return {
    id: attachment._id.toString(),
    projectId: attachment.projectId.toString(),
    taskId: attachment.taskId ? attachment.taskId.toString() : undefined,
    userId: attachment.userId.toString(),
    fileName: attachment.fileName,
    fileUrl: `/attachments/${attachment._id}/download`,
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
