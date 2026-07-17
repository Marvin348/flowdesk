import express from "express";
import cors from "cors";
import projectsRouter from "@/features/projects/routes/index";
import tasksRouter from "@/features/tasks/routes/tasks";
import usersRouter from "@/features/users/routes/index";
import attachmentsRouter from "@/features/attachments/routes/attachments";
import commentsRouter from "@/features/comments/routes/comments";
import dashboardRouter from "@/features/dashboard/routes/dashboard";
import workspaceInvitesRouter from "@/features/workspace-invites/routes/workspaceInvite.routes";
import authRouter from "@/features/auth/routes/authRoutes";
import cookieParser from "cookie-parser";
import { requireAuth } from "@/features/auth/middleware/requireAuth";
import { errorHandler } from "@/middleware/errorHandler";
import activityRouter from "@/features/activity/routes/activity.routes";

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
