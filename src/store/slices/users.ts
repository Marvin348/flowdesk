import { mockUsers } from "@/data/mockUsers";
import type { User } from "@/type/user";

export type UserSlice = {
  users: User[];
};

export const createUsersSlice = (set) => ({
  users: mockUsers,
});
