import { mockAttachments } from "@/data/mockAttachments";
import type { Attachment } from "@/type/attachment";

export type AttachmentsSlice = {
  attachments: Attachment[];
};

export const createAttachmentsSlice = (set) => ({
  attachments: mockAttachments,
});
