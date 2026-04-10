import express from "express";
import { readDb } from "../utils/readDb.js";
import { writeDb } from "../utils/writeDb.js";
import { Comment } from "../types/index.js";

const router = express.Router();

router.get("/", (req, res) => {
  const db = readDb();
  res.json(db.comments);
});

router.post("/", (req, res) => {
  const { taskId, message, parentCommentId } = req.body;

  if (!taskId || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const db = readDb();

  const task = db.tasks.find((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  // Nur prüfen, WENN es eine Reply ist
  if (parentCommentId) {
    const parentComment = db.comments.find(
      (comment) => comment.id === parentCommentId,
    );

    if (!parentComment) {
      return res.status(404).json({ error: "Parent comment not found" });
    }

    if (parentComment.taskId !== taskId) {
      return res.status(400).json({
        error: "Parent comment does not belong to this task",
      });
    }
  }

  const newComment: Comment = {
    id: crypto.randomUUID(),
    taskId,
    userId: "u3", // test, remove later
    message,
    createdAt: new Date().toISOString(),
    parentCommentId,
  };

  db.comments.push(newComment);

  writeDb(db);

  return res.status(201).json({ data: newComment });
});

// export type Comments = {
//   id: string;
//   taskId: string;
//   userId: string;
//   message: string;
//   createdAt: string;
//   parentCommentId?: string
// };

// export type CreateCommentInput = {
//     taskId: string;
//     message: string;
// }

// export type CreateCommentReplyInput = {
//   taskId: string;
//   message: string;
//   parentCommentId: string;
// };

export default router;
