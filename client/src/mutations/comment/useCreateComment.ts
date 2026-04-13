import type { Comment } from "@shared/types/comment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateCommentInput } from "@shared/types/inputs/createCommentInput";
import { createComment } from "@/api/comments";

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation<Comment, Error, CreateCommentInput>({
    mutationFn: createComment,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", "details"] });
    },
  });
};
