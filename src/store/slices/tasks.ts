import { mockTasks } from "@/data/mockTasks";
import type { Task } from "@/type/task";

export type TasksSlice = {
  tasks: Task[];
};

export const createTasksSlice = () => ({
  tasks: mockTasks,
});
