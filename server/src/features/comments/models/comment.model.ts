import mongoose from "mongoose";
import { CommentDocument } from "../types/comment.document.js";

const commentSchema = new mongoose.Schema(
  {
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

export const CommentModel = mongoose.model<CommentDocument>(
  "Comment",
  commentSchema,
);
