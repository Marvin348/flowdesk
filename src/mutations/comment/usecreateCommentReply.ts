import type { Comments } from "@/type/domain/comments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateCommentReplyInput } from "@/type/inputs/createCommentReplyInput";
import { createCommentReply } from "@/api/comments";

export const useCreateCommentReply = () => {
  const queryClient = useQueryClient();

  return useMutation<Comments, Error, CreateCommentReplyInput>({
    mutationFn: createCommentReply,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};
