import type { Types } from "mongoose";

export type CommentDocument = {
  _id: Types.ObjectId;
  taskId: string;
  userId: string;
  message: string;
  createdAt: Date;
  parentCommentId?: string;
};
