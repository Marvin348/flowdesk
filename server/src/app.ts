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

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());


app.use("/auth", authRouter);
app.use("/dashboard", dashboardRouter);
app.use("/projects", projectsRouter);
app.use("/tasks", tasksRouter);
app.use("/users", usersRouter);
app.use("/attachments", attachmentsRouter);
app.use("/comments", commentsRouter);

export default app;
