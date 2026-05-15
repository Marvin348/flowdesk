import type { Attachment } from "@shared/types/attachment.js";

type AttachmentDbRecord = Attachment & {
  _id?: unknown;
  __v?: number;
};

export const toAttachmentDto = (attachment: AttachmentDbRecord): Attachment => {
  return {
    id: attachment.id,
    taskId: attachment.taskId,
    userId: attachment.userId,
    fileName: attachment.fileName,
    url: attachment.url,
  };
};

export const toAttachmentDtos = (
  attachments: AttachmentDbRecord[],
): Attachment[] => {
  return attachments.map(toAttachmentDto);
};
