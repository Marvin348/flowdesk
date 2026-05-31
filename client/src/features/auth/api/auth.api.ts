import { apiClient } from "@/shared/api/client";

type LoginInput = {
  email: string;
  password: string;
};

export const login = async (input: LoginInput) => {
  const res = await apiClient.post("/auth/login", input);

  return res.data;
};

export const getCurrentUser = async () => {
  const res = await apiClient.get("/auth/me");
  return res.data;
};

export const logout = async () => {
  const res = await apiClient.post("/auth/logout");
  return res.data
};
