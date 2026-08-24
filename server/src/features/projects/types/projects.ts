import { ClientSession, Types } from "mongoose";

export type TouchProjectInput = {
  projectId: string | Types.ObjectId;
  workspaceId: Types.ObjectId;
  session?: ClientSession;
};
