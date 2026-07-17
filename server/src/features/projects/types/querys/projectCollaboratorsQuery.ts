import type { ProjectCollaboratorSort } from "@shared/types/sort/projectCollaboratorSort";

export type ProjectCollaboratorsQuery = {
  collaboratorsSort?: ProjectCollaboratorSort;
  page?: string;
  limit?: string;
};
