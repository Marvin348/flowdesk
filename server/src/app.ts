import express from "express";
import cors from "cors";
import projectsRouter from "./routes/projects.js";
import tasksRouter from "./routes/tasks.js";
import usersRouter from "./routes/users.js";
import attachmentsRouter from "./routes/attachments.js";
import commentsRouter from "./routes/comments.js";
import { readDb } from "./utils/readDb.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/projects", projectsRouter);
app.use("/tasks", tasksRouter);
app.use("/users", usersRouter);
app.use("/attachments", attachmentsRouter);
app.use("/comments", commentsRouter);

const db = readDb();

app.get("/api/health", (req, res) => {
  res.json({ message: "server is running" });
});

export default app;
