import type { Comment } from "@shared/types/comment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateCommentInput } from "@shared/types/inputs/createCommentInput";
import { createComment } from "@/features/comments/api/comments.api.ts";

// query key needs to add
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation<Comment, Error, CreateCommentInput>({
    mutationFn: createComment,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", "details", variables.taskId],
      });
    },
  });
};
