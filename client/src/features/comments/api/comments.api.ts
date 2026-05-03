import type { Comment } from "@shared/types/comment";
import { apiClient } from "@/shared/api/client";
import type { CreateCommentInput } from "@shared/types/inputs/createCommentInput";

export const fetchComments = async (): Promise<Comment[]> => {
  const res = await apiClient.get("/comments");
  return res.data.data;
};

export const createComment = async (
  input: CreateCommentInput,
): Promise<Comment> => {
  const res = await apiClient.post("/comments", input);

  return res.data.data;
};
