import type { Types } from "mongoose";

export type AttachmentDocument = {
  _id: Types.ObjectId;
  workspaceId: Types.ObjectId;
  projectId: string;
  taskId?: string | null;
  userId: string;

  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;

  createdAt: Date;
};
