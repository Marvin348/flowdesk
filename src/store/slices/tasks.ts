import { mockTasks } from "@/data/mockTasks";
import type { Task } from "@/type/task";
import type { StateCreator } from "zustand";
import type { AppStore } from "@/store";

export type TasksSlice = {
  tasks: Task[];
};

export const createTasksSlice: StateCreator<
  AppStore,
  [],
  [],
  TasksSlice
> = () => ({
  tasks: mockTasks,
});
