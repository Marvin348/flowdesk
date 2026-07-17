import app from "@/app";
import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import mongoose from "mongoose";
import {
  createAuthedUserContext,
  createProject,
  createUser,
} from "@/test/helpers/testFactories";
import { ProjectModel } from "@/features/projects/models/project.model";

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("PATCH /users/project-assignments", () => {
  it("returns 401 when the user is not authenticated", async () => {
    const response = await request(app).patch("/users/project-assignments");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Not authenticated" });
  });

  it("returns 400 if the body is invalid", async () => {
    const { authCookie } = await createAuthedUserContext();
    const otherUser = new mongoose.Types.ObjectId().toString();

    const response = await request(app)
      .patch("/users/project-assignments")
      .send({ userId: otherUser, projectIdsToAdd: ["false"] })
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid body" });
  });

  it("returns 403 if the user is not a admin", async () => {
    const { authCookie, workspaceId } = await createAuthedUserContext({
      role: "member",
    });

    const selectedUser = await createUser({ workspaceId });
    const project = await createProject({ workspaceId });

    const response = await request(app)
      .patch("/users/project-assignments")
      .send({
        userId: selectedUser._id.toString(),
        projectIdsToAdd: [project._id.toString()],
      })
      .set("Cookie", authCookie);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "Only admins can assign new projects",
    });
  });

  it("returns 404 if the selected user was not found", async () => {
    const { authCookie, workspaceId } = await createAuthedUserContext();

    const missingUserId = new mongoose.Types.ObjectId().toString();
    const project = await createProject({ workspaceId });

    const response = await request(app)
      .patch("/users/project-assignments")
      .send({
        userId: missingUserId,
        projectIdsToAdd: [project._id.toString()],
      })
      .set("Cookie", authCookie);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "User not found" });
  });

  it("returns 400 if one or more projects do not exist in the workspace", async () => {
    const { authCookie, workspaceId } = await createAuthedUserContext();

    const selectedUser = await createUser({ workspaceId });
    const missingProjectId = new mongoose.Types.ObjectId().toString();

    const response = await request(app)
      .patch("/users/project-assignments")
      .send({
        userId: selectedUser._id.toString(),
        projectIdsToAdd: [missingProjectId],
      })
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "One or more projects are missing",
    });
  });

  it("returns 409 if the selected user is already assigned to one of the projects", async () => {
    const { authCookie, workspaceId } = await createAuthedUserContext();

    const selectedUser = await createUser({ workspaceId });
    const project = await createProject({
      workspaceId,
      invitedUserIds: [selectedUser._id],
    });

    const response = await request(app)
      .patch("/users/project-assignments")
      .send({
        userId: selectedUser._id.toString(),
        projectIdsToAdd: [project._id.toString()],
      })
      .set("Cookie", authCookie);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: "User already in project" });
  });

  it("assigns the selected user to projects", async () => {
    const { authCookie, workspaceId } = await createAuthedUserContext();

    const selectedUser = await createUser({ workspaceId });
    const firstProject = await createProject({ workspaceId });
    const secondProject = await createProject({ workspaceId });

    const response = await request(app)
      .patch("/users/project-assignments")
      .send({
        userId: selectedUser._id.toString(),
        projectIdsToAdd: [
          firstProject._id.toString(),
          secondProject._id.toString(),
        ],
      })
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "User assigned to projects successfully",
    });

    const updatedProjects = await ProjectModel.find({
      _id: { $in: [firstProject._id, secondProject._id] },
    }).lean();

    expect(updatedProjects).toHaveLength(2);
    expect(
      updatedProjects.every((project) =>
        project.invitedUserIds.some(
          (userId) => userId.toString() === selectedUser._id.toString(),
        ),
      ),
    ).toBe(true);
  });
});
