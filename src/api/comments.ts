import type { Comments } from "@/type/domain/comments";
import { apiClient } from "@/api/client";
import type { CreateCommentReplyInput } from "@/type/inputs/createCommentReplyInput";
import type { CreateCommentInput } from "@/type/inputs/createCommentInput";

export const fetchComments = async (taskId?: string): Promise<Comments[]> => {
  const url = taskId ? `/comments?taskId=${taskId}` : "/comments";
  const res = await apiClient.get(url);
  return res.data;
};

export const createComment = async (
  input: CreateCommentInput,
): Promise<Comments> => {
  const res = await apiClient.post(`/comments`, {
    id: crypto.randomUUID(),
    userId: "u3", // TEST
    taskId: input.taskId,
    message: input.message,
    createdAt: new Date().toISOString(),
  });

  return res.data;
};

export const createCommentReply = async (
  input: CreateCommentReplyInput,
): Promise<Comments> => {
  const res = await apiClient.post(`/comments`, {
    id: crypto.randomUUID(),
    taskId: input.taskId,
    userId: "u3", // TEST
    message: input.message,
    parentCommentId: input.parentCommentId,
    createdAt: new Date().toISOString(),
  });

  return res.data;
};
