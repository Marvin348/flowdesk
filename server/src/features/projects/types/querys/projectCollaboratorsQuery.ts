import type { ProjectCollaboratorSort } from "@shared/types/sort/projectCollaboratorSort.js";

export type ProjectCollaboratorsQuery = {
  collaboratorsSort?: ProjectCollaboratorSort;
  page?: string;
  limit?: string;
};
