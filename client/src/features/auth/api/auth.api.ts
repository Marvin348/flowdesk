import { apiClient } from "@/shared/api/client";
import type { AuthUser } from "@shared/types/user";
import type { PasswordFields } from "@/features/auth/schemas/securitySchema";
import type { RegisterFields } from "@/features/auth/schemas/registerSchema";
import type { LoginFields } from "@/features/auth/schemas/loginSchema";

export const login = async (input: LoginFields) => {
  const res = await apiClient.post("/auth/login", input);
  return res.data.user;
};

export const getCurrentUser = async (): Promise<AuthUser> => {
  const res = await apiClient.get("/auth/me");
  return res.data.user;
};

export const logout = async () => {
  const res = await apiClient.post("/auth/logout");
  return res.data.user;
};

export const register = async (input: RegisterFields): Promise<AuthUser> => {
  const res = await apiClient.post("/auth/register", input);
  return res.data.user;
};

export const verifyEmail = async (token: string): Promise<string> => {
  const res = await apiClient.post("/auth/verify-email", { token });
  return res.data.message;
};

export const resendVerificationEmail = async (
  email: string,
): Promise<string> => {
  const res = await apiClient.post("/auth/resend-verification-email", {
    email,
  });
  return res.data.message;
};

export const requestUpdatePassword = async (input: PasswordFields) => {
  const res = await apiClient.post("/auth/password/change-request", input);
  return res.data.message;
};

export const verifyChangePassword = async (token: string) => {
  const res = await apiClient.post("/auth/password/change/verify", { token });
  return res.data.message;
};
