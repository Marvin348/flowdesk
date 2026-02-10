import { mockUsers } from "@/data/mockUsers";
import type { User } from "@/type/user";
import type { StateCreator } from "zustand";
import type { AppStore } from "@/store";

export type UserSlice = {
  users: User[];
};

export const createUsersSlice: StateCreator<AppStore, [], [], UserSlice> = (
  set,
) => ({
  users: mockUsers,
});
