import type { StateCreator } from "zustand";
import type { AppStore } from "@/store";

export type TaskModalMode = "create" | "edit";

export type TaskModalState = {
  isOpen: boolean;
  mode: TaskModalMode;
  taskId: string | null;
  projectId: string | null;
  initialCollaboratorIds: string[];
};

export type TaskModalSlice = {
  isOpen: boolean;
  mode: TaskModalMode;
  taskId: string | null;
  projectId: string | null;
  initialCollaboratorIds: string[];

  openCreateTask: (input: {
    projectId: string;
    initialCollaboratorIds?: string[];
  }) => void;

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
  initialCollaboratorIds: [],

  openCreateTask: ({ projectId, initialCollaboratorIds = [] }) =>
    set({
      isOpen: true,
      mode: "create",
      projectId,
      taskId: null,
      initialCollaboratorIds,
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
      initialCollaboratorIds: [],
    }),
});
