import type { Types } from "mongoose";

export type CommentDocument = {
  _id: Types.ObjectId;
  workspaceId: Types.ObjectId;
  taskId: Types.ObjectId;
  userId: Types.ObjectId;
  message: string;
  createdAt: Date;
  parentCommentId?: Types.ObjectId;
};
