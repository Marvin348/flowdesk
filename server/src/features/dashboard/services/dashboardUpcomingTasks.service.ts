import { TaskModel } from "@/features/tasks/models/task.model.js";
import { ProjectModel } from "@/features/projects/models/project.model.js";
import { toTaskDto } from "@/features/tasks/mappers/task.mapper.js";
import { toProjectDto } from "@/features/projects/mappers/project.mapper.js";
import { mapUpcomingTasks } from "@/features/dashboard/mappers/mapUpcomingTasks.js";

export const getUpcomingTasks = async () => {
  const taskRecords = await TaskModel.find({
    taskStatus: { $ne: "done" },
  })
    .sort({ dueDate: 1 })
    .limit(5)
    .lean();

  const projectIds = [...new Set(taskRecords.map((task) => task.projectId))];

  const projectRecords = await ProjectModel.find({
    _id: { $in: projectIds },
  }).lean();

  const tasks = taskRecords.map(toTaskDto);
  const projects = projectRecords.map(toProjectDto);

  return mapUpcomingTasks(projects, tasks);
};
