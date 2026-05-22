import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAttachment } from "@/features/projects/api/projectAttachments.api";
import type { Attachment } from "@shared/types/attachment";
import type { UploadProjectAttachmentsInput } from "@shared/types/inputs/createAttachmentInput";

export const useCreateAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation<Attachment, Error, UploadProjectAttachmentsInput>({
    mutationFn: createAttachment,

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
