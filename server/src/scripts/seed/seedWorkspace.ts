import { WorkspaceModel } from "@/features/workspace/models/workspace.model";
import { Types } from "mongoose";

export const seedWorkspace = async ({
  workspaceId,
  ownerId,
}: {
  workspaceId: Types.ObjectId;
  ownerId: Types.ObjectId;
}) => {
  const workspace = await WorkspaceModel.create({
    _id: workspaceId,
    name: "Demo Workspace",
    ownerId,
  });

  return workspace._id;
};
