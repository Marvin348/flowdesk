import type { StateCreator } from "zustand";
import type { AppStore } from "@/store";

export type ProjectInviteModalSlice = {
  isProjectInviteOpen: boolean;
  openProjectInvite: () => void;
  closeProjectInvite: () => void;
};

export const createProjectInviteSlice: StateCreator<
  AppStore,
  [],
  [],
  ProjectInviteModalSlice
> = (set) => ({
  isProjectInviteOpen: false,

  openProjectInvite: () => set({ isProjectInviteOpen: true }),

  closeProjectInvite: () => set({ isProjectInviteOpen: false }),
});
