import { apiClient } from "@/shared/api/client";
import type { ProjectOptionsDto } from "@shared/types/dto/projects/projectOptions.dto";
import type { ProjectOptionsInput } from "@shared/types/inputs/projectOptionsInput";

export const userProjectOptions = async ({
  search,
  userId,
}: ProjectOptionsInput): Promise<ProjectOptionsDto> => {
  const res = await apiClient.get("/users/project-options", {
    params: {
      search,
      userId,
    },
  });
  return res.data.data;
};
