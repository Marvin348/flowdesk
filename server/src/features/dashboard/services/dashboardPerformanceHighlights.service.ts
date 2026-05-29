import { mapPerformanceHighlights } from "@/features/dashboard/mappers/mapPerformanceHighlights.js";
import { getUserPerformance } from "@/features/dashboard/utils/getUserPerformance.js";
import { toTaskDto } from "@/features/tasks/mappers/task.mapper.js";
import { TaskModel } from "@/features/tasks/models/task.model.js";
import { toUserDto } from "@/features/users/mappers/user.mapper.js";
import { UserModel } from "@/features/users/models/user.modal.js";

export const getPerformanceHighlights = async () => {
  const [userRecords, taskRecords] = await Promise.all([
    UserModel.find().lean(),
    TaskModel.find().lean(),
  ]);

  const users = userRecords.map(toUserDto);
  const tasks = taskRecords.map(toTaskDto);

  const userPerformance = getUserPerformance(users, tasks);

  return mapPerformanceHighlights(userPerformance);
};
