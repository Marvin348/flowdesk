import { TaskModel } from "@/features/tasks/models/task.model.js";
import { toTaskDto } from "@/features/tasks/mappers/task.mapper.js";
import { mapUpcomingTasks } from "@/features/dashboard/mappers/mapUpcomingTasks.js";
import { getProjects } from "@/features/projects/services/project.service.js";

export const getUpcomingTasks = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const projects = await getProjects({ workspaceId });
  const projectIds = projects.map((project) => project.id);

  const taskRecords = await TaskModel.find({
    workspaceId,
    projectId: { $in: projectIds },
    taskStatus: { $ne: "done" },
  })
    .sort({ dueDate: 1 })
    .limit(5)
    .lean();

  const tasks = taskRecords.map(toTaskDto);

  return mapUpcomingTasks(projects, tasks);
};
