import mongoose from "mongoose";
import { ActivityDocument } from "@/features/activity/types/activity.model.js";
import {
  ACTIVITY_TYPES,
  ENTITY_TYPES,
} from "@shared/types/dto/activity/activity.dto.js";

const activitySchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: ACTIVITY_TYPES,
    },

    entityType: {
      type: String,
      required: true,
      enum: ENTITY_TYPES,
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

export const ActivityModel = mongoose.model<ActivityDocument>(
  "Activity",
  activitySchema,
);
