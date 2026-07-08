import type { Comment } from "@shared/types/comment.js";
import type { CommentDocument } from "@/features/comments/types/comment.document.js";

const toIsoString = (value: string | Date | undefined): string => {
  if (!value) return "";

  return value instanceof Date ? value.toISOString() : value;
};

export const toCommentDto = (comment: CommentDocument): Comment => {
  return {
    id: comment._id.toString(),
    taskId: comment.taskId.toString(),
    userId: comment.userId.toString(),
    message: comment.message ?? "",
    createdAt: toIsoString(comment.createdAt),
    parentCommentId: comment.parentCommentId ?? undefined,
  };
};

export const toCommentDtos = (comments: CommentDocument[]): Comment[] => {
  return comments.map(toCommentDto);
};
