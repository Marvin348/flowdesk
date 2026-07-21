import type { StateCreator } from "zustand";
import type { AppStore } from "@/store";

export type TaskModalMode = "create" | "edit";

export type TaskModalState = {
  isOpen: boolean;
  mode: TaskModalMode;
  taskId: string | null;
  projectId: string | null;
};

export type TaskModalSlice = {
  isOpen: boolean;
  mode: TaskModalMode;
  taskId: string | null;
  projectId: string | null;

  openCreateTask: (projectId: string) => void;
  openEditTask: (projectId: string, taskId: string) => void;
  closeTaskModal: () => void;
};

export const createTaskModalSlice: StateCreator<
  AppStore,
  [],
  [],
  TaskModalSlice
> = (set) => ({
  isOpen: false,
  mode: "create",
  taskId: null,
  projectId: null,

  openCreateTask: (projectId) =>
    set({
      isOpen: true,
      mode: "create",
      projectId,
      taskId: null,
    }),

  openEditTask: (projectId, taskId) =>
    set({
      isOpen: true,
      mode: "edit",
      projectId,
      taskId,
    }),

  closeTaskModal: () =>
    set({
      isOpen: false,
      mode: "create",
      projectId: null,
      taskId: null,
    }),

});
