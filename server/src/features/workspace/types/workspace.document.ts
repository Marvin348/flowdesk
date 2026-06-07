import { Types } from "mongoose";

export type WorkspaceDocument = {
  _id: Types.ObjectId;
  ownerId: Types.ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};
