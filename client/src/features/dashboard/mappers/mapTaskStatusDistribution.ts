import type { TaskStatusDistributionDto } from "@shared/types/dto/dashboard/taskStatusDistribution.dto";
import { STATUS_OPTIONS } from "@/shared/constants/status-options";

export type TaskStatusDistributionItem = {
  id: keyof TaskStatusDistributionDto;
  label: string;
  value: number;
  color: string;
};

export const mapTaskStatusDistribution = (
  distribution: TaskStatusDistributionDto,
): TaskStatusDistributionItem[] => {
  return Object.entries(STATUS_OPTIONS).map(([key, config]) => {
    return {
      id: key as keyof TaskStatusDistributionDto,
      label: config.label,
      color: config.color,
      value: distribution[key as keyof TaskStatusDistributionDto],
    };
  });
};
