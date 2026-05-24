import type { Comment } from "@shared/types/comment.js";

type CommentDbRecord = Omit<Comment, "id" | "createdAt"> & {
  _id: { toString: () => string };
  __v?: number;
  createdAt: string | Date;
};

const toIsoString = (value: string | Date | undefined): string => {
  if (!value) return "";

  return value instanceof Date ? value.toISOString() : value;
};

export const toCommentDto = (comment: CommentDbRecord): Comment => {
  return {
    id: comment._id.toString(),
    taskId: comment.taskId,
    userId: comment.userId,
    message: comment.message ?? "",
    createdAt: toIsoString(comment.createdAt),
    parentCommentId: comment.parentCommentId ?? undefined,
  };
};

export const toCommentDtos = (comments: CommentDbRecord[]): Comment[] => {
  return comments.map(toCommentDto);
};
