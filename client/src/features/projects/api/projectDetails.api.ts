import { apiClient } from "@/shared/api/client";
import type { UserWorkload } from "@shared/types/dto/workload/projectUserWorkload";
import type { ProjectTaskDto } from "@shared/types/dto/projects/projectTasks.dto";
import type { ProjectDetailsShellDto } from "@shared/types/dto/projects/projectDetailsShell.dto";
import type { ProjectOverviewDto } from "@shared/types/dto/projects/projectOverview.dto";
import type { ProjectCommentsResponseDto } from "@shared/types/dto/projects/projectComments.dto";
import type { ProjectCollaboratorDto } from "@shared/types/dto/projects/projectCollaborators.dto";

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
  id: string,
): Promise<ProjectCollaboratorDto[]> => {
  const res = await apiClient.get(`/projects/${id}/collaborators`);
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
