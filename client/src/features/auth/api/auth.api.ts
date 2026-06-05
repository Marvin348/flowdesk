import { apiClient } from "@/shared/api/client";
import type { User } from "@shared/types/user";
import type { PasswordFields } from "@/features/auth/schemas/securitySchema";
import type { RegisterFields } from "@/features/auth/schemas/registerSchema";
import type { LoginFields } from "@/features/auth/schemas/loginSchema";

export const login = async (input: LoginFields) => {
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

export const register = async (input: RegisterFields) => {
  const res = await apiClient.post("/auth/register", input);
  return res.data;
};

export const updatePassword = async (input: PasswordFields) => {
  const res = await apiClient.patch("/auth/password", input);
  return res.data;
};
