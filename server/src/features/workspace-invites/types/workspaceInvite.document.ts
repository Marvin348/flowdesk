import { Types } from "mongoose";

export type WorkspaceInviteDocument = {
  email: string;
  token: string;
  workspaceId: Types.ObjectId;
  role: "member";
  createdBy: Types.ObjectId;
  expiresAt: Date;
  usedAt?: Date;
};
