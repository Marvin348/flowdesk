import { Types } from "mongoose";
import { createNotification } from "@/features/notification/services/createNotification.service";

type HandleCommentReplyNotificationInput = {
  workspaceId: string;
  actorId: string;
  recipientId: string;
  commentId: string;
  projectId: string;
};

export const handleCommentReplyNotification = async ({
  workspaceId,
  actorId,
  recipientId,
  commentId,
  projectId,
}: HandleCommentReplyNotificationInput) => {
  if (actorId === recipientId) return;

  const actorObjectId = new Types.ObjectId(actorId);
  const workspaceObjectId = new Types.ObjectId(workspaceId);
  const recipientObjectId = new Types.ObjectId(recipientId);
  const commentObjectId = new Types.ObjectId(commentId);
  const projectObjectId = new Types.ObjectId(projectId);

  await createNotification({
    workspaceId: workspaceObjectId,
    actorId: actorObjectId,
    recipientId: recipientObjectId,
    type: "comment_reply",
    entityType: "comment",
    entityId: commentObjectId,
    projectId: projectObjectId,
  });
};
