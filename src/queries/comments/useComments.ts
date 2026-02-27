import { fetchComments } from "@/api/comments";
import { useQuery } from "@tanstack/react-query";

export const useComments = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["comments"],
    queryFn: fetchComments,
  });

  return { data, isLoading, error };
};
