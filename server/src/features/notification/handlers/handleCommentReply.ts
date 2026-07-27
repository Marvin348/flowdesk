import { Types } from "mongoose";
import { createNotification } from "@/features/notification/services/createNotification.service";

type HandleCommentReplyInput = {
  workspaceId: Types.ObjectId;
  actorId: Types.ObjectId;
  recipientId: Types.ObjectId;
  commentId: Types.ObjectId;
  projectId: Types.ObjectId;
};

export const handleCommentReply = async ({
  workspaceId,
  actorId,
  recipientId,
  commentId,
  projectId,
}: HandleCommentReplyInput) => {
  if (actorId.equals(recipientId)) return;

  await createNotification({
    workspaceId,
    actorId,
    recipientId,
    type: "comment_reply",
    entityType: "comment",
    entityId: commentId,
    projectId,
  });
};
