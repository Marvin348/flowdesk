import { Types } from "mongoose";

export type PasswordChangedEvent = {
  workspaceId: Types.ObjectId;
  recipientId: Types.ObjectId;
};
