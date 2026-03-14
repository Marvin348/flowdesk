import type { Comments } from "@/type/comments";
import { apiClient } from "@/api/client";

export const fetchComments = async (taskId?: string): Promise<Comments[]> => {
  const url = taskId ? `/comments?taskId=${taskId}` : "/comments";
  const res = await apiClient.get(url);
  return res.data;
};
