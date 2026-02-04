import { mockTasks } from "@/mock/mockSubtasks";
import type { Task } from "@/type/subtask";

export type TasksSlice = {
  tasks: Task[];
};

export const createTasksSlice = () => ({
  tasks: mockTasks,

});
