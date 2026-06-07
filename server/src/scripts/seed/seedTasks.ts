import { TaskModel } from "@/features/tasks/models/task.model.js";
import { requireMappedId } from "@/scripts/seed/seedUtils.js";
import type { SeedTask } from "@/scripts/seed/types.js";
import { Types } from "mongoose";

type SeedTaskInput = {
  tasks: SeedTask[];
  projectIdMap: Map<string, string>;
  userIdMap: Map<string, string>;
  workspaceId: Types.ObjectId;
};

export const seedTasks = async ({
  tasks,
  projectIdMap,
  userIdMap,
  workspaceId,
}: SeedTaskInput) => {
  const taskIdMap = new Map<string, string>();

  for (const task of tasks) {
    const createdTask = await TaskModel.create({
      projectId: requireMappedId(
        projectIdMap,
        task.projectId,
        "task.projectId",
      ),

      workspaceId,

      title: task.title,
      dueDate: task.dueDate,
      taskStatus: task.taskStatus,
      taskPriority: task.taskPriority,

      collaboratorIds: task.collaboratorIds.map((userId) =>
        requireMappedId(userIdMap, userId, "task.collaboratorIds"),
      ),

      description: task.description,
      tags: task.tags,
      reminderAt: task.reminderAt,
      completedAt: task.completedAt,
    });

    taskIdMap.set(task.id, createdTask._id.toString());
  }

  return taskIdMap;
};
