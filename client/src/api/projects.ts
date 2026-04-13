import { apiClient } from "@/api/client";
import type { Project } from "@shared/types/project";
import type { CreateProjectInput } from "@shared/types/inputs/createProjectInput";
import type { ProjectSummaryDto } from "@shared/types/dto/project";
import type { ProjectDetailsDto } from "@shared/types/dto/project";
import type {UpdateProjectMembersInput} from "@shared/types/inputs/updateProjectMembersInput"

export const fetchProjects = async (): Promise<Project[]> => {
  const res = await apiClient.get("/projects");
  return res.data.data;
};

// new
export const fetchProject = async (id: string): Promise<Project> => {
  const res = await apiClient.get(`/projects/${id}`);
  return res.data;
};

// new details with all endpoints
export const fetchProjectDetails = async (
  id: string,
): Promise<ProjectDetailsDto> => {
  const res = await apiClient.get(`/projects/${id}/details`);
  return res.data.data;
};


// fetch summaries
export const fetchProjectSummaries = async (): Promise<ProjectSummaryDto[]> => {
  const res = await apiClient.get("/projects/summary");

  return res.data.data;
};

export const createProject = async (
  input: CreateProjectInput,
): Promise<Project> => {
  const res = await apiClient.post(`/projects`, input);

  return res.data.data;
};

// old
export const updateProjectMembers = async (
  input: UpdateProjectMembersInput,
): Promise<Project> => {
  const res = await apiClient.patch(`/projects/${input.projectId}`, input);

  return res.data.data;
};

// old
export const deleteProject = async (id: string): Promise<Project> => {
  const res = await apiClient.delete(`/projects/${id}`);
  return res.data;
};
