import { apiClient } from "@/shared/api/client";
import type { UserWorkload } from "@shared/types/dto/workload/projectUserWorkload";
import type { ProjectTaskDto } from "@shared/types/dto/projects/projectTasks.dto";
import type { ProjectDetailsShellDto } from "@shared/types/dto/projects/projectDetailsShell.dto";
import type { ProjectOverviewDto } from "@shared/types/dto/projects/projectOverview.dto";
import type { ProjectCommentsResponseDto } from "@shared/types/dto/projects/projectComments.dto";
import type { ProjectCollaboratorResponseDto } from "@shared/types/dto/projects/projectCollaborators.dto";
import type { ProjectCollaboratorsInput } from "@shared/types/inputs/projectCollaboratorsInput";

export const fetchProjectDetailsShell = async (
  id: string,
): Promise<ProjectDetailsShellDto> => {
  const res = await apiClient.get(`/projects/${id}/details`);
  return res.data.data;
};

export const fetchProjectOverview = async (
  id: string,
): Promise<ProjectOverviewDto> => {
  const res = await apiClient.get(`/projects/${id}/overview`);
  return res.data.data;
};

export const fetchProjectTasks = async (
  id: string,
): Promise<ProjectTaskDto[]> => {
  const res = await apiClient.get(`/projects/${id}/tasks`);
  return res.data.data;
};

export const fetchProjectCollaborators = async (
  input: ProjectCollaboratorsInput,
): Promise<ProjectCollaboratorResponseDto> => {
  const params = new URLSearchParams({
    page: String(input.page),
    limit: String(input.limit),
  });

  if (input.sort) {
    params.set("collaboratorsSort", input.sort);
  }

  const res = await apiClient.get(
    `/projects/${input.projectId}/collaborators?${params.toString()}`,
  );
  return res.data.data;
};

export const fetchProjectComments = async (
  id: string,
): Promise<ProjectCommentsResponseDto> => {
  const res = await apiClient.get(`/projects/${id}/comments`);
  return res.data.data;
};

export const fetchProjectWorkload = async (
  id: string,
): Promise<UserWorkload[]> => {
  const res = await apiClient.get(`/projects/${id}/workload`);
  return res.data.data;
};
