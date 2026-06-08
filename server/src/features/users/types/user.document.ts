import type { Types } from "mongoose";

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
};
