import type { Types } from "mongoose";

export type UserRole = "admin" | "member" | "manager";

export type UserDocument = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  avatarKey: string;
  role: UserRole;
  jobTitle?:
    | "Frontend Developer"
    | "Designer"
    | "Project Manager"
    | "Backend Developer"
    | "Art Director"
    | "Fullstack Developer"
    | "DevOps Engineer"
    | "QA Engineer"
    | "Motion Designer";
};
