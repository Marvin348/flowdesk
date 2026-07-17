import mongoose from "mongoose";
import { WorkspaceDocument } from "@/features/workspace/types/workspace.document";

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const WorkspaceModel = mongoose.model<WorkspaceDocument>(
  "Workspace",
  workspaceSchema,
);
