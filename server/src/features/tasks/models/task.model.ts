import { Task } from "@shared/types/task.js";
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    dueDate: {
      type: String,
      required: true,
    },

    taskStatus: {
      type: String,
      enum: ["pending", "in_progress", "done"],
      required: true,
    },

    collaboratorIds: {
      type: [String],
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
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const TaskModel = mongoose.model<Task>("Task", taskSchema);
