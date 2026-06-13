import type { Types } from "mongoose";
import type { AppearanceSettings } from "@shared/types/user.js";

export type UserRole = "admin" | "member" | "manager";

export type UserDocument = {
  _id: Types.ObjectId;
  workspaceId: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  avatarKey: string;
  role: UserRole;
  jobTitle?: string;

  appearanceSettings: AppearanceSettings;
};
