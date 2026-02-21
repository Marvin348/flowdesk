import type { Comments } from "@/type/comments";
import { apiClient } from "@/api/client";

export const fetchComments = async (): Promise<Comments[]> => {
  const res = await apiClient.get("/comments");
  return res.data;
};
