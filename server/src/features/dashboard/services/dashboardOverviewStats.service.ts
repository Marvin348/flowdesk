import { mapDashboardOverviewStats } from "@/features/dashboard/mappers/mapDashboardOverviewStats";
import { getProjects } from "@/features/projects/services/project.service";
import { TaskModel } from "@/features/tasks/models/task.model";
import { Types } from "mongoose";

export const getOverviewStats = async ({
  workspaceId,
}: {
  workspaceId: Types.ObjectId;
}) => {
  const projects = await getProjects({ workspaceId });

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
