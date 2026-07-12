import { apiClient } from "@/shared/api/client";
import type { ProjectOptionsDto } from "@shared/types/dto/projects/projectOptions.dto";
import type { AssignUserToProjectsInput } from "@shared/types/inputs/assignUserToProjectsInput";
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

export const assignProjectsToUser = async ({
  userId,
  projectIdsToAdd,
}: AssignUserToProjectsInput) => {
  const res = await apiClient.patch("/users/project-assignments", {
    userId,
    projectIdsToAdd,
  });
  return res.data.message;
};
