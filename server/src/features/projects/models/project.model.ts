import mongoose from "mongoose";
import { ProjectDocument } from "@/features/projects/types/project.document.js";

const projectSchema = new mongoose.Schema(
  {
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

export const ProjectModel = mongoose.model<ProjectDocument>("Project", projectSchema);
