import { WorkspaceInviteDocument } from "@/features/workspace-invites/types/workspaceInvite.document.js";
import mongoose from "mongoose";
import { Types } from "mongoose";

const workspaceInviteSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    token: {
      type: String,
      required: true,
      unique: true,
    },

    workspaceId: {
      type: Types.ObjectId,
      required: true,
      ref: "Workspace",
    },

    role: {
      type: String,
      enum: ["member"],
      default: "member",
      required: true,
    },

    createdBy: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    usedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const WorkspaceInviteModel = mongoose.model<WorkspaceInviteDocument>(
  "WorkspaceInvite",
  workspaceInviteSchema,
);
