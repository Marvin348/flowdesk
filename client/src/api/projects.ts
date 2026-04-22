import { apiClient } from "@/api/client";
import type { Project } from "@shared/types/project";
import type { CreateProjectInput } from "@shared/types/inputs/createProjectInput";
import type {
  ProjectDetailsDto,
  ProjectOptionsDto,
} from "@shared/types/dto/project";
import type { UpdateProjectMembersInput } from "@shared/types/inputs/updateProjectMembersInput";
import type { AssignUserToProjectsInput } from "@shared/types/inputs/assignUserToProjectsInput";
import type { ProjectSummariesInput } from "@shared/types/inputs/projectSummariesInput";
import type { ProjectSummariesResponseDto } from "@shared/types/dto/project";

export const fetchProjects = async (): Promise<Project[]> => {
  const res = await apiClient.get("/projects");
  return res.data.data;
};

export const fetchProject = async (id: string): Promise<Project> => {
  const res = await apiClient.get(`/projects/${id}`);
  return res.data;
};

export const fetchProjectDetails = async (
  id: string,
): Promise<ProjectDetailsDto> => {
  const res = await apiClient.get(`/projects/${id}/details`);
  return res.data.data;
};

export const fetchProjectSummaries = async (
  input: ProjectSummariesInput,
): Promise<ProjectSummariesResponseDto> => {
  const params = new URLSearchParams({
    search: input.search,
    page: String(input.page),
    limit: String(input.limit),
  });

  if (input.filter?.priority) params.set("priority", input.filter?.priority);
  if (input.filter?.status) params.set("status", input.filter?.status);
  if (typeof input.filter?.hasAttachments === "boolean") {
    params.set("hasAttachments", String(input.filter?.hasAttachments));
  }

  const res = await apiClient.get(`/projects/summaries?${params.toString()}`);
  return res.data.data;
};

// `/projects/summaries?search=${input.search}&priority=${input.priority}&status=${input.status}&hasAttachments=${input.hasAttachments}&page=${input.page}&limit=${input.limit}`,

export const fetchProjectsOptions = async (
  userId: string,
  input: string,
): Promise<ProjectOptionsDto> => {
  const res = await apiClient.get(
    `/projects/options?userId=${userId}&search=${input}`,
  );
  return res.data.data;
};

export const assignUserToProjects = async (
  input: AssignUserToProjectsInput,
): Promise<Project[]> => {
  const res = await apiClient.patch("/projects/assign-user", input);
  return res.data.data;
};

export const createProject = async (
  input: CreateProjectInput,
): Promise<Project> => {
  const res = await apiClient.post(`/projects`, input);
  return res.data.data;
};

export const deleteProject = async (id: string): Promise<Project> => {
  const res = await apiClient.delete(`/projects/${id}`);
  return res.data;
};

export const updateProjectMembers = async (
  input: UpdateProjectMembersInput,
): Promise<Project> => {
  const res = await apiClient.patch(
    `/projects/${input.projectId}/members`,
    input,
  );
  return res.data.data;
};
