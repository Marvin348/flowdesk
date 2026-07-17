import { UserPreviewDto } from "@shared/types/dto/common/userPreview.dto";

export type UserPerformance = {
  user: UserPreviewDto;
  stats: {
    completedCount: number;
    openTasks: number;
    progressPercent: number;
    tasksCount: number;
  };
};
