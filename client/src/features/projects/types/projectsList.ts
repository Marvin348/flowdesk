import type { Badge } from "@/store/slices/projectBadge";
import type { ProjectSummariesDto } from "@shared/types/dto/projects/projectSummary.dto";

export type ProjectListVM = ProjectSummariesDto & {
  badge?: Badge;
};

export type ProjectsListVM = {
  projects: ProjectListVM[];
  isLoading: boolean;
  error: Error | null;
};
