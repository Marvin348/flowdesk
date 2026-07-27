import { Types } from "mongoose";

export type CommentReplyEvent = {
  workspaceId: Types.ObjectId;
  actorId: Types.ObjectId;
  recipientId: Types.ObjectId;
  commentId: Types.ObjectId;
  projectId: Types.ObjectId;
};
