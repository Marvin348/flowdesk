import express from "express";
import { readDb } from "@/utils/readDb.js";
import { writeDb } from "@/utils/writeDb.js";
import { Comment } from "@shared/types/comment.js";
import type { Request, Response } from "express";
import type { CreateCommentInput } from "@shared/types/inputs/createCommentInput.js";

const router = express.Router();

router.get("/", (req, res) => {
  const db = readDb();
  res.json({ data: db.comments });
});

// new comment
router.post("/", (req: Request<{}, {}, CreateCommentInput>, res) => {
  const { taskId, message, parentCommentId } = req.body;

  if (!taskId || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const db = readDb();

  const task = db.tasks.find((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

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

export default router;
