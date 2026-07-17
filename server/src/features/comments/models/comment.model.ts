import mongoose from "mongoose";
import { CommentDocument } from "@/features/comments/types/comment.document";

const commentSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    message: {
      type: String,
    },
    createdAt: {
      type: String,
    },
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
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
