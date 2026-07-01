import type { Types } from "mongoose";
import type { AppearanceSettingsType } from "@shared/types/user.js";

export type UserRole = "admin" | "member" | "manager";

export type UserDocument = {
  _id: Types.ObjectId;
  workspaceId: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  isEmailVerified: boolean;
  emailVerifiedAt?: Date;
  avatarStorageKey?: string;
  avatarKey: string;
  role: UserRole;
  jobTitle?: string;

  appearanceSettings: AppearanceSettingsType;
};
