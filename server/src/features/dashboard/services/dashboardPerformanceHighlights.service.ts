import { mapPerformanceHighlights } from "@/features/dashboard/mappers/mapPerformanceHighlights";
import { getUserPerformance } from "@/features/dashboard/utils/getUserPerformance";
import { getProjects } from "@/features/projects/services/project.service";
import { toTaskDto } from "@/features/tasks/mappers/task.mapper";
import { TaskModel } from "@/features/tasks/models/task.model";
import { toUserDto } from "@/features/users/mappers/user.mapper";
import { UserModel } from "@/features/users/models/user.modal";
import { Types } from "mongoose";

export const getPerformanceHighlights = async ({
  workspaceId,
}: {
  workspaceId: Types.ObjectId;
}) => {
  const projects = await getProjects({ workspaceId });
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
