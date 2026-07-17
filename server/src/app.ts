import express from "express";
import cors from "cors";
import projectsRouter from "@/features/projects/routes/index.js";
import tasksRouter from "@/features/tasks/routes/tasks.js";
import usersRouter from "@/features/users/routes/index.js";
import attachmentsRouter from "@/features/attachments/routes/attachments.js";
import commentsRouter from "@/features/comments/routes/comments.js";
import dashboardRouter from "@/features/dashboard/routes/dashboard.js";
import workspaceInvitesRouter from "@/features/workspace-invites/routes/workspaceInvite.routes.js";
import authRouter from "@/features/auth/routes/authRoutes.js";
import cookieParser from "cookie-parser";
import { requireAuth } from "@/features/auth/middleware/requireAuth.js";
import { errorHandler } from "@/middleware/errorHandler.js";
import activityRouter from "@/features/activity/routes/activity.routes.js";

const app = express();

const CLIENT_URL = process.env.CLIENT_URL;

if (!CLIENT_URL) {
  throw new Error("CLIENT_URL is not defined");
}

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.use("/auth", authRouter);
app.use("/dashboard", requireAuth, dashboardRouter);
app.use("/projects", requireAuth, projectsRouter);
app.use("/tasks", requireAuth, tasksRouter);
app.use("/users", requireAuth, usersRouter);
app.use("/attachments", requireAuth, attachmentsRouter);
app.use("/comments", requireAuth, commentsRouter);

app.use("/workspace-invites", workspaceInvitesRouter);
app.use("/activity", requireAuth, activityRouter);

app.use(errorHandler);

export default app;
