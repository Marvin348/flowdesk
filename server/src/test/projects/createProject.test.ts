import app from "@/app.js";
import { ProjectModel } from "@/features/projects/models/project.model.js";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb.js";
import request from "supertest";
import {
  createAuthedUserContext,
  createUser,
} from "@/test/helpers/testFactories.js";
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

describe("POST /projects", () => {
  it("returns 400 if invalid input", async () => {
    const { authCookie } = await createAuthedUserContext();

    const response = await request(app)
      .post("/projects")
      .send({
        title: "",
      })
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid input" });
  });

  it("returns 403 if the user is not a admin", async () => {
    const { authCookie, workspaceId } = await createAuthedUserContext({
      role: "member",
    });
    const invitedUser = await createUser({
      workspaceId,
      role: "member",
    });

    const response = await request(app)
      .post("/projects")
      .send({
        title: "testTitle",
        dueDate: "12-05",
        projectStatus: "pending",
        priority: "medium",
        invitedUserIds: [invitedUser._id.toString()],
      })
      .set("Cookie", authCookie);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "Only admins can create projects",
    });

    const project = await ProjectModel.findOne({ title: "testTitle" });
    expect(project).toBeNull();
  });

  it("returns 400 if the userCount is not matching", async () => {
    const { authCookie } = await createAuthedUserContext();

    const invalidUserId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .post("/projects")
      .send({
        title: "testTitle",
        dueDate: "12-05",
        projectStatus: "pending",
        priority: "medium",
        invitedUserIds: [invalidUserId.toString()],
      })
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "One or more users are invalid",
    });
  });

  it("creates new Project", async () => {
    const { authCookie, workspaceId, userId } = await createAuthedUserContext();

    const invitedUser = await createUser({
      workspaceId,
      role: "member",
    });

    const response = await request(app)
      .post("/projects")
      .send({
        title: "testTitle",
        dueDate: "12-05",
        projectStatus: "pending",
        priority: "medium",
        invitedUserIds: [invitedUser._id.toString()],
      })
      .set("Cookie", authCookie);

    expect(response.status).toBe(201);
    expect(response.body.data).toMatchObject({
      title: "testTitle",
      dueDate: "12-05",
      projectStatus: "pending",
      priority: "medium",
      ownerId: userId.toString(),
      invitedUserIds: [invitedUser._id.toString()],
    });

    const project = await ProjectModel.findById(response.body.data.id);
    expect(project).not.toBeNull();
  });
});
