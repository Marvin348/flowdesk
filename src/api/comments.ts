import type { Comments } from "@/type/domain/comments";
import { apiClient } from "@/api/client";
import type { CreateCommentReplyInput } from "@/type/inputs/createCommentReplyInput";

export const fetchComments = async (taskId?: string): Promise<Comments[]> => {
  const url = taskId ? `/comments?taskId=${taskId}` : "/comments";
  const res = await apiClient.get(url);
  return res.data;
};

export const createCommentReply = async (
  input: CreateCommentReplyInput,
): Promise<Comments> => {
  const res = await apiClient.post(`/comments`, {
    id: crypto.randomUUID(),
    taskId: input.taskId,
    userId: "u3", // TESTING
    message: input.message,
    parentCommentId: input.parentCommentId,
    createdAt: new Date().toISOString(),
  });

  return res.data;
};
