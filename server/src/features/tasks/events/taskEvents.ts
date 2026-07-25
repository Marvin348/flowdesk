import { Types } from "mongoose";
import type { TaskDocument } from "../types/task.document";

export type TaskCreatedEvent = {
  actorId: Types.ObjectId;
  workspaceId: Types.ObjectId;
  task: TaskDocument;
};

export type TaskUpdateEvent = {
  actorId: Types.ObjectId;
  workspaceId: Types.ObjectId;

  taskId: Types.ObjectId;
  projectId: Types.ObjectId;

  previousCollaboratorIds: Types.ObjectId[];
  currentCollaboratorIds: Types.ObjectId[];
};
