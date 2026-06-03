import { apiClient } from "@/shared/api/client";
import type { User } from "@shared/types/user";

type LoginInput = {
  email: string;
  password: string;
};

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export const login = async (input: LoginInput) => {
  const res = await apiClient.post("/auth/login", input);
  return res.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const res = await apiClient.get("/auth/me");
  return res.data.user;
};

export const logout = async () => {
  const res = await apiClient.post("/auth/logout");
  return res.data.user;
};

export const register = async (input: RegisterInput) => {
  const res = await apiClient.post("/auth/register", input);
  return res.data;
};
