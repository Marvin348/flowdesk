import type { TaskStatusDistribution } from "@/features/dashboard/utils/getTaskStatusDistribution";
import { STATUS_OPTIONS } from "@/shared/constants/status-options";

export type TaskStatusDistributionItem = {
  id: keyof TaskStatusDistribution;
  label: string;
  value: number;
  color: string;
};

export const mapTaskStatusDistributionToItems = (
  distribution: TaskStatusDistribution,
): TaskStatusDistributionItem[] => {
  return Object.entries(STATUS_OPTIONS).map(([key, config]) => {
    return {
      id: key as keyof TaskStatusDistribution,
      label: config.label,
      value: distribution[key as keyof TaskStatusDistribution],
      color: config.color,
    };
  });
};
