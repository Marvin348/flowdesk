import mongoose from "mongoose";
import { createTask } from "@/test/helpers/testFactories";

export const createProjectTasks = async ({
  workspaceId,
  projectId,
  openTasks,
  doneTasks,
}: {
  workspaceId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  openTasks: number;
  doneTasks: number;
}) => {
  for (let index = 0; index < openTasks; index += 1) {
    await createTask({
      workspaceId,
      projectId,
      taskStatus: "pending",
      dueDate: new Date(2026, 8, 20),
    });
  }

  for (let index = 0; index < doneTasks; index += 1) {
    await createTask({
      workspaceId,
      projectId,
      taskStatus: "done",
      dueDate: new Date(2026, 8, 20),
    });
  }
};