import type { ProjectAttachmentResponseDto } from "@shared/types/dto/projects/projectAttachments.dto";
import type { ProjectAttachmentInput } from "@shared/types/inputs/projectAttachmentInput";
import { apiClient } from "@/shared/api/client";
import type { UploadProjectAttachmentsInput } from "@shared/types/inputs/createAttachmentInput";

export const fetchProjectAttachments = async (
  input: ProjectAttachmentInput,
): Promise<ProjectAttachmentResponseDto> => {
  const res = await apiClient.get(`/projects/${input.projectId}/files`, {
    params: {
      search: input.search,
      page: input.page,
      limit: input.limit,
    },
  });

  return res.data.data;
};

export const createAttachment = async ({
  projectId,
  taskId,
  files,
}: UploadProjectAttachmentsInput) => {
  const formData = new FormData();

  for (const file of files) {
    formData.append("files", file);
  }

  if (taskId) {
    formData.append("taskId", taskId);
  }

  const res = await apiClient.post(`/projects/${projectId}/files`, formData);
  return res.data.data;
};
