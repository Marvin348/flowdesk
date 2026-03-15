import type { User } from "@/type/domain/user";
import { apiClient } from "@/api/client";

export const fetchUsers = async (): Promise<User[]> => {
  const res = await apiClient.get("/users");
  return res.data;
};
