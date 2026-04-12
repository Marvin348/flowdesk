import { fetchComments } from "@/api/comments";
import { useQuery } from "@tanstack/react-query";
import type { Comments } from "@/type/domain/comments";

export const useTaskComments = (taskId: string) => {
  const { data, isLoading, error } = useQuery<Comments[], Error>({
    queryKey: ["comments", taskId],
    queryFn: () => fetchComments(taskId),
  });

  return { data, isLoading, error };
};
