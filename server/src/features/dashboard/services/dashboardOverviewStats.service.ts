import { mapDashboardOverviewStats } from "@/features/dashboard/mappers/mapDashboardOverviewStats";
import { ProjectModel } from "@/features/projects/models/project.model";
import { TaskModel } from "@/features/tasks/models/task.model";
import { Types } from "mongoose";
import { getDashboardDateRange } from "@/features/dashboard/utils/getDashboardDateRange";

export const getOverviewStats = async ({
  workspaceId,
}: {
  workspaceId: Types.ObjectId;
}) => {
  const { startOfToday, endOfWeek } = getDashboardDateRange();

  const [activeProjects, openTasks, overdueTasks, tasksDueThisWeek] =
    await Promise.all([
      ProjectModel.countDocuments({
        workspaceId,
        projectStatus: { $ne: "done" },
      }),

      TaskModel.countDocuments({
        workspaceId,
        taskStatus: { $in: ["pending", "in_progress"] },
      }),

      TaskModel.countDocuments({
        workspaceId,
        taskStatus: { $in: ["pending", "in_progress"] },
        dueDate: { $lt: startOfToday },
      }),

      TaskModel.countDocuments({
        workspaceId,
        taskStatus: { $in: ["pending", "in_progress"] },
        dueDate: {
          $gte: startOfToday,
          $lte: endOfWeek,
        },
      }),
    ]);

  return mapDashboardOverviewStats({
    activeProjects,
    openTasks,
    overdueTasks,
    tasksDueThisWeek,
  });
};
