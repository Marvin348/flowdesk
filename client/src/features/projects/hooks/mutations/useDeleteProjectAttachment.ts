import type { Attachment } from "@shared/types/attachment";
import type { DeleteAttachmentInput } from "@shared/types/inputs/deleteAttachmentInput";
import { deleteProjectAttachment } from "@/features/projects/api/projectAttachments.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteProjectAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation<Attachment, Error, DeleteAttachmentInput>({
    mutationFn: deleteProjectAttachment,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId, "attachments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["projects", variables.projectId, "details"],
      });
    },
  });
};
