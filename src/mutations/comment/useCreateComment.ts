import type { Comments } from "@/type/domain/comments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateCommentInput } from "@/type/inputs/createCommentInput";
import { createComment } from "@/api/comments";

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation<Comments, Error, CreateCommentInput>({
    mutationFn: createComment,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};
