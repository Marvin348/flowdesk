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
      require: true,
      unique: true,
    },
    userId: {
      type: String,
      require: true,
      unique: true,
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

export const CommentModal = mongoose.model("Comment", commentSchema);
