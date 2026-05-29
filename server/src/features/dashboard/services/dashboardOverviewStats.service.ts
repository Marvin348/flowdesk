import { mapDashboardOverviewStats } from "@/features/dashboard/mappers/mapDashboardOverviewStats.js";
import { ProjectModel } from "@/features/projects/models/project.model.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";

export const getOverviewStats = async () => {
  const [activeProjects, totalTasks, doneTasks, openTasks] = await Promise.all([
    ProjectModel.countDocuments({ projectStatus: { $ne: "done" } }),
    TaskModel.countDocuments(),
    TaskModel.countDocuments({ taskStatus: "done" }),
    TaskModel.countDocuments({ taskStatus: { $in: ["pending", "in_progress"] } }),
  ]);

  return mapDashboardOverviewStats({
    activeProjects,
    totalTasks,
    doneTasks,
    openTasks,
  });
};
