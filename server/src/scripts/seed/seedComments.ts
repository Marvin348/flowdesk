import type { SeedComment } from "@/scripts/seed/types.js";
import { requireMappedId } from "@/scripts/seed/seedUtils.js";
import { CommentModel } from "@/features/comments/models/comment.model.js";
import { Types } from "mongoose";

type SeedCommentsInput = {
  comments: SeedComment[];
  taskIdMap: Map<string, string>;
  userIdMap: Map<string, string>;
  workspaceId: Types.ObjectId;
};

export const seedComments = async ({
  comments,
  taskIdMap,
  userIdMap,
  workspaceId,
}: SeedCommentsInput) => {
  const commentIdMap = new Map<string, string>();

  for (const comment of comments) {
    const createdComment = await CommentModel.create({
      taskId: requireMappedId(taskIdMap, comment.taskId, "comment.taskId"),
      userId: requireMappedId(userIdMap, comment.userId, "comment.userId"),
      message: comment.message,
      createdAt: comment.createdAt,

      workspaceId,

      parentCommentId: comment.parentCommentId
        ? requireMappedId(
            commentIdMap,
            comment.parentCommentId,
            "comment.parentCommentId",
          )
        : undefined,
    });

    commentIdMap.set(comment.id, createdComment._id.toString());
  }
};
