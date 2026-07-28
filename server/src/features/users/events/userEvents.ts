import type { UserRole } from "@shared/types/user";
import { Types } from "mongoose";

export type ChangeUserRoleEvent = {
  actorId: Types.ObjectId;
  workspaceId: Types.ObjectId;
  recipientId: Types.ObjectId;
  previousRole: UserRole;
  currentRole: UserRole;
};

export type EmailChangedEvent = {
  workspaceId: Types.ObjectId;
  recipientId: Types.ObjectId;
};
