import { mapDashboardOverviewStats } from "@/features/dashboard/mappers/mapDashboardOverviewStats.js";
import { getProjects } from "@/features/projects/services/project.service.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";

export const getOverviewStats = async ({
  userId,
  workspaceId,
}: {
  userId: string;
  workspaceId: string;
}) => {
  const projects = await getProjects({ userId, workspaceId });

  const projectIds = projects.map((project) => project.id);
  const activeProjects = projects.filter(
    (project) => project.projectStatus !== "done",
  ).length;

  const [totalTasks, doneTasks, openTasks] = await Promise.all([
    TaskModel.countDocuments({ workspaceId, projectId: { $in: projectIds } }),
    TaskModel.countDocuments({
      workspaceId,
      projectId: { $in: projectIds },
      taskStatus: "done",
    }),
    TaskModel.countDocuments({
      workspaceId,
      projectId: { $in: projectIds },
      taskStatus: { $in: ["pending", "in_progress"] },
    }),
  ]);

  return mapDashboardOverviewStats({
    activeProjects,
    totalTasks,
    doneTasks,
    openTasks,
  });
};
