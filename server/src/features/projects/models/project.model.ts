import { Project } from "@shared/types/project.js";
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    id: { // id gets removed later
      type: String,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      require: true,
    },

    description: {
      type: String,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },

    projectStatus: {
      type: String,
      enum: ["pending", "in_progress", "done"],
      required: true,
    },

    dueDate: {
      type: String,
      required: true,
    },

    invitedUserIds: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const ProjectModel = mongoose.model<Project>("Project", projectSchema);
