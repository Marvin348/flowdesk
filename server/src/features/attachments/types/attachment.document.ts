import type { Types } from "mongoose";

export type AttachmentDocument = {
  _id: Types.ObjectId;
  workspaceId: Types.ObjectId;
  projectId: Types.ObjectId;
  taskId?: Types.ObjectId | null;
  userId: Types.ObjectId;

  fileName: string;
  storageKey: string;
  mimeType: string;
  fileSize: number;

  createdAt: Date;
};
