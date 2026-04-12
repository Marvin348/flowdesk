import type { Comments } from "@/type/domain/comments";
import { apiClient } from "@/api/client";
import type { CreateCommentInput } from "@/type/inputs/createCommentInput";

export const fetchComments = async (): Promise<Comments[]> => {
  const res = await apiClient.get("/comments");
  return res.data.data;
};

// export const fetchComments = async (taskId?: string): Promise<Comments[]> => {
//   const url = taskId ? `/comments?taskId=${taskId}` : "/comments";
//   const res = await apiClient.get(url);
//   return res.data;
// };

export const createComment = async (
  input: CreateCommentInput,
): Promise<Comments> => {
  const res = await apiClient.post("/comments", input);

  return res.data.data;
};
