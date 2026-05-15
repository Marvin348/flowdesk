import { Comment } from "@shared/types/comment.js";
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    id: {
      // id gets removed later
      type: String,
      required: true,
      unique: true,
    },
    taskId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
    createdAt: {
      type: String,
    },
    parentCommentId: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const CommentModel = mongoose.model<Comment>("Comment", commentSchema);
