import app from "@/app";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import request from "supertest";
import {
  createAuthedUserContext,
  createProject,
  createTask,
  createUser,
} from "@/test/helpers/testFactories";
import mongoose from "mongoose";

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("GET /projects/:projectId/tasks/overview", () => {
  it("returns 400 if the projectId is invalid", async () => {
    const { authCookie } = await createAuthedUserContext();

    const response = await request(app)
      .get(`/projects/invalid-id/tasks/overview`)
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid projectId" });
  });

  it("returns project tasks grouped by status", async () => {
    const { authCookie, workspaceId, userId } = await createAuthedUserContext();
    const projectId = new mongoose.Types.ObjectId();

    const collaborator = await createUser({
      workspaceId,
      name: "Task Collaborator",
      avatarStorageKey: "avatars/task-collaborator.png",
    });

    await createProject({
      _id: projectId,
      workspaceId,
      ownerId: userId.toString(),
    });

    const pendingTask = await createTask({
      workspaceId,
      projectId,
      title: "Pending project task",
      dueDate: "2026-07-20",
      taskStatus: "pending",
      taskPriority: "high",
      description: "Needs initial planning",
      tags: ["planning", "project"],
      collaboratorIds: [collaborator._id],
    });

    await Promise.all(
      Array.from({ length: 5 }).map((_, index) =>
        createTask({
          workspaceId,
          projectId,
          title: `Additional pending task ${index + 1}`,
          dueDate: `2026-07-2${index + 1}`,
          taskStatus: "pending",
          taskPriority: "medium",
        }),
      ),
    );

    const inProgressTask = await createTask({
      workspaceId,
      projectId,
      title: "In progress project task",
      dueDate: "2026-07-19",
      taskStatus: "in_progress",
      taskPriority: "medium",
    });

    const doneTask = await createTask({
      workspaceId,
      projectId,
      title: "Done project task",
      dueDate: "2026-07-18",
      taskStatus: "done",
      taskPriority: "low",
    });

    await createTask({
      workspaceId,
      projectId: new mongoose.Types.ObjectId(),
      title: "Other project task",
    });

    const response = await request(app)
      .get(`/projects/${projectId}/tasks/overview`)
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({
      pending: {
        tasks: expect.arrayContaining([
          {
            id: pendingTask._id.toString(),
            projectId: projectId.toString(),
            title: "Pending project task",
            dueDate: new Date("2026-07-20").toISOString(),
            taskStatus: "pending",
            taskPriority: "high",
            tags: ["planning", "project"],
            reminderAt: "",
            completedAt: "",
            collaborators: [
              {
                id: collaborator._id.toString(),
                avatarUrl:
                  "https://public-r2.test/avatars/task-collaborator.png",
              },
            ],
          },
        ]),
        total: 6,
        hasMore: true,
      },
      in_progress: {
        tasks: [
          {
            id: inProgressTask._id.toString(),
            projectId: projectId.toString(),
            title: "In progress project task",
            dueDate: new Date("2026-07-19").toISOString(),
            taskStatus: "in_progress",
            taskPriority: "medium",
            tags: [],
            reminderAt: "",
            completedAt: "",
            collaborators: [],
          },
        ],
        total: 1,
        hasMore: false,
      },
      done: {
        tasks: [
          {
            id: doneTask._id.toString(),
            projectId: projectId.toString(),
            title: "Done project task",
            dueDate: new Date("2026-07-18").toISOString(),
            taskStatus: "done",
            taskPriority: "low",
            tags: [],
            reminderAt: "",
            completedAt: "",
            collaborators: [],
          },
        ],
        total: 1,
        hasMore: false,
      },
    });
    expect(response.body.data.pending.tasks).toHaveLength(5);
  });
});
