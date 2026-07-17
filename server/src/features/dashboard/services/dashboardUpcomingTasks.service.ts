import { TaskModel } from "@/features/tasks/models/task.model";
import { toTaskDto } from "@/features/tasks/mappers/task.mapper";
import { mapUpcomingTasks } from "@/features/dashboard/mappers/mapUpcomingTasks";
import { getProjects } from "@/features/projects/services/project.service";
import { Types } from "mongoose";

export const getUpcomingTasks = async ({
  workspaceId,
}: {
  workspaceId: Types.ObjectId;
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
