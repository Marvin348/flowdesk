import {
  createCommentsSlice,
  type CommentsSlice,
} from "@/store/slices/comments";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  createProjectsSlice,
  type ProjectsSlice,
} from "@/store/slices/projects";
import { createUsersSlice, type UserSlice } from "@/store/slices/users";

import {
  createAttachmentsSlice,
  type AttachmentsSlice,
} from "@/store/slices/attachments";
import { createTasksSlice, type TasksSlice } from "@/store/slices/tasks";
import {
  createFilterSlice,
  type FilterSlice,
} from "@/store/slices/ui-state/filter";
import {
  createSearchQuerySlice,
  type SearchQuerySlice,
} from "@/store/slices/ui-state/search";

export type AppStore = CommentsSlice &
  ProjectsSlice &
  UserSlice &
  AttachmentsSlice &
  TasksSlice &
  FilterSlice &
  SearchQuerySlice;

export const useAppStore = create<AppStore>()(
  persist(
    (...a) => ({
      ...createCommentsSlice(...a),
      ...createProjectsSlice(...a),
      ...createUsersSlice(...a),
      ...createAttachmentsSlice(...a),
      ...createTasksSlice(...a),

      // UI STATE
      ...createFilterSlice(...a),
      ...createSearchQuerySlice(...a),
    }),
    {
      name: "AppStore",
      partialize: (state) => ({
        projects: state.projects,
        users: state.users,
        comments: state.comments,
        attachments: state.attachments,
        tasks: state.tasks,
      }),
    },
  ),
);
