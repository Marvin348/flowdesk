import { Types } from "mongoose";

export type ProjectCreatedEvent = {
  actorId: Types.ObjectId;
  workspaceId: Types.ObjectId;
  projectId: Types.ObjectId;
  invitedUserIds: Types.ObjectId[];
};

export type ProjectMembersAddedEvent = {
  actorId: Types.ObjectId;
  workspaceId: Types.ObjectId;
  addedUserIds: Types.ObjectId[];
  projectId: Types.ObjectId;
};
