import { mockAttachments } from "@/data/mockAttachments";
import type { Attachment } from "@/type/attachment";
import type { StateCreator } from "zustand";
import type { AppStore } from "@/store";

export type AttachmentsSlice = {
  attachments: Attachment[];
};

export const createAttachmentsSlice: StateCreator<
  AppStore,
  [],
  [],
  AttachmentsSlice
> = (set) => ({
  attachments: mockAttachments,
});
