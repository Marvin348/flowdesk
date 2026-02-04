import { mockUsers } from "@/data/mockUsers";

export const fetchUsers = async () => {
  await new Promise((r) => setTimeout(r, 400));
  return mockUsers;
};
