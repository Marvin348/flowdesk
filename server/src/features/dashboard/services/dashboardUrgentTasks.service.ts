import { TaskModel } from "@/features/tasks/models/task.model";
import { buildDashboardUrgentTasksPipeline } from "@/features/tasks/queries/UrgentTasks.pipeline";
import { Types } from "mongoose";
import { getDashboardDateRange } from "@/features/dashboard/utils/getDashboardDateRange";
import type { DashboardUrgentTasksAggregationResult } from "@/features/dashboard/mappers/mapUrgentTask";
import { mapUrgentTask } from "@/features/dashboard/mappers/mapUrgentTask";
import type { DashboardUrgentTaskDto } from "@shared/types/dto/dashboard/dashboardUrgentTasks.dto";

type GetDashboardUrgentTasksInput = {
  workspaceId: Types.ObjectId;
};

export const getDashboardUrgentTasks = async ({
  workspaceId,
}: GetDashboardUrgentTasksInput): Promise<DashboardUrgentTaskDto> => {
  const { endOfWeek, startOfToday } = getDashboardDateRange();

  const pipeline = buildDashboardUrgentTasksPipeline({
    workspaceId,
    endOfWeek,
    startOfToday,
    limit: 5,
  });

  const [result] =
    await TaskModel.aggregate<DashboardUrgentTasksAggregationResult>(pipeline);

  const dueThisWeek = result?.dueThisWeekItems ?? [];
  const dueThisWeekTotal = result?.dueThisWeekTotal ?? 0;

  const overdue = result?.overdueItems ?? [];
  const overdueTotal = result?.overdueTotal ?? 0;

  const maxItems = 7;

  const dueThisWeekItems = dueThisWeek.slice(0, maxItems);
  const remainingSlots = maxItems - dueThisWeekItems.length;
  const overdueItems = overdue.slice(0, remainingSlots);

  return {
    dueThisWeek: {
      total: dueThisWeekTotal,
      items: dueThisWeekItems.map(mapUrgentTask),
    },
    overdue: {
      total: overdueTotal,
      items: overdueItems.map(mapUrgentTask),
    },
  };
};
