import express from "express";
import cors from "cors";
import projectsRouter from "@/features/projects/routes/index.js";
import tasksRouter from "@/features/tasks/routes/tasks.js";
import usersRouter from "@/features/users/routes/users.js";
import attachmentsRouter from "@/features/attachments/routes/attachments.js";
import commentsRouter from "@/features/comments/routes/comments.js";
import dashboardRouter from "@/features/dashboard/routes/dashboard.js";
import authRouter from "@/features/auth/routes/authRoutes.js";
import cookieParser from "cookie-parser";
import { requireAuth } from "@/features/auth/middleware/requireAuth.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/dashboard", requireAuth, dashboardRouter);
app.use("/projects", requireAuth, projectsRouter);
app.use("/tasks", requireAuth, tasksRouter);
app.use("/users", requireAuth, usersRouter);
app.use("/attachments", requireAuth, attachmentsRouter);
app.use("/comments", requireAuth, commentsRouter);

export default app;
