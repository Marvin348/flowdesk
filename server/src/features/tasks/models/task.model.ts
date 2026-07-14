import mongoose from "mongoose";
import { TaskDocument } from "@/features/tasks/types/task.document.js";

const taskSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    taskStatus: {
      type: String,
      enum: ["pending", "in_progress", "done"],
      required: true,
    },

    collaboratorIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },

    taskPriority: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },

    description: {
      type: String,
    },

    tags: {
      type: [String],
      default: [],
    },

    reminderAt: {
      type: String,
    },

    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const TaskModel = mongoose.model<TaskDocument>("Task", taskSchema);
