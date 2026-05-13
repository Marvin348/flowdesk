import type { ProjectCollaboratorSort } from "../sort/projectCollaboratorSort";

export type ProjectCollaboratorsInput = {
  projectId: string;
  page: number;
  limit: number;
  sort?: ProjectCollaboratorSort;
};
