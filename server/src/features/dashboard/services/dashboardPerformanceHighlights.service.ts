import { mapPerformanceHighlights } from "@/features/dashboard/mappers/mapPerformanceHighlights.js";
import { getUserPerformance } from "@/features/dashboard/utils/getUserPerformance.js";
import { getProjects } from "@/features/projects/services/project.service.js";
import { toTaskDto } from "@/features/tasks/mappers/task.mapper.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { toUserDto } from "@/features/users/mappers/user.mapper.js";
import { UserModel } from "@/features/users/models/user.modal.js";

export const getPerformanceHighlights = async ({
  userId,
  workspaceId,
}: {
  userId: string;
  workspaceId: string;
}) => {
  const projects = await getProjects({ userId, workspaceId });
  const projectIds = projects.map((project) => project.id);

  const [userRecords, taskRecords] = await Promise.all([
    UserModel.find({ workspaceId }).lean(),
    TaskModel.find({
      workspaceId,
      projectId: { $in: projectIds },
    }).lean(),
  ]);

  const users = userRecords.map(toUserDto);
  const tasks = taskRecords.map(toTaskDto);

  const userPerformance = getUserPerformance(users, tasks);

  return mapPerformanceHighlights(userPerformance);
};
