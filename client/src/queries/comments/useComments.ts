import { fetchComments } from "@/api/comments";
import type { Comment } from "@shared/types/comment";
import { useQuery } from "@tanstack/react-query";

export const useComments = () => {
  const { data, isLoading, error } = useQuery<Comment[], Error>({
    queryKey: ["comments"],
    queryFn: () => fetchComments(),
  });

  return { data, isLoading, error };
};
