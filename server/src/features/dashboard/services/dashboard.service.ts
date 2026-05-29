import { toProjectDto } from "@/features/projects/mappers/project.mapper.js";
import { ProjectModel } from "@/features/projects/models/project.model.js";
import { toTaskDto } from "@/features/tasks/mappers/task.mapper.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { toUserDto } from "@/features/users/mappers/user.mapper.js";
import { UserModel } from "@/features/users/models/user.modal.js";
import { toDashboardOverviewDto } from "@/features/dashboard/mappers/toDashboardOverviewDto.js";

export const getDashboardOverview = async () => {
  // gets refactored later
  const [projectRecords, taskRecords, userRecords] = await Promise.all([
    ProjectModel.find().lean(),
    TaskModel.find().lean(),
    UserModel.find().lean(),
  ]);

  const projects = projectRecords.map(toProjectDto);
  const tasks = taskRecords.map(toTaskDto);
  const users = userRecords.map(toUserDto);

  return toDashboardOverviewDto({ projects, tasks, users });
};
