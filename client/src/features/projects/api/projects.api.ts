import { apiClient } from "@/shared/api/client";
import type { Project } from "@shared/types/project";
import type { CreateProjectInput } from "@shared/types/inputs/createProjectInput";
import type { ProjectOptionsDto } from "@shared/types/dto/projects/projectOptions.dto";
import type { ProjectSummariesInput } from "@shared/types/inputs/projectSummariesInput";
import type { ProjectSummariesResponseDto } from "@shared/types/dto/projects/projectSummary.dto";

export const fetchProjects = async (): Promise<Project[]> => {
  const res = await apiClient.get("/projects");
  return res.data.data;
};

export const fetchProject = async (id: string): Promise<Project> => {
  const res = await apiClient.get(`/projects/${id}`);
  return res.data;
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

export const fetchProjectsOptions = async (
  userId: string,
  input: string,
): Promise<ProjectOptionsDto> => {
  const res = await apiClient.get(
    `/projects/options?userId=${userId}&search=${input}`,
  );
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
