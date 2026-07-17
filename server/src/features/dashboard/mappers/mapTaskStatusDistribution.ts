import { calcPercent } from "@shared/utils/calcPercent";
import type { TaskStatusDistributionDto } from "@shared/types/dto/dashboard/taskStatusDistribution.dto";

type MapTaskStatusDistributionParams = {
  pending: number;
  in_progress: number;
  done: number;
};

export const mapTaskStatusDistribution = ({
  pending,
  in_progress,
  done,
}: MapTaskStatusDistributionParams): TaskStatusDistributionDto => {
  const totalTasks = pending + in_progress + done;

  return {
    pending: calcPercent(pending, totalTasks),
    in_progress: calcPercent(in_progress, totalTasks),
    done: calcPercent(done, totalTasks),
  };
};
