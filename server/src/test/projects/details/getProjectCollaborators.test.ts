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

describe("GET /projects/:projectId/collaborators", () => {
  it("returns 400 if the projectId is invalid", async () => {
    const { authCookie } = await createAuthedUserContext();

    const response = await request(app)
      .get(`/projects/invalid-id/collaborators`)
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid projectId" });
  });

  it("returns 400 if the query is invalid", async () => {
    const { authCookie } = await createAuthedUserContext();
    const projectId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/projects/${projectId}/collaborators`)
      .query({ collaboratorsSort: "invalid-sort" })
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid query" });
  });

  it("returns 404 if the project not exists", async () => {
    const { authCookie } = await createAuthedUserContext();
    const invalidProjectId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .get(`/projects/${invalidProjectId}/collaborators`)
      .query({ collaboratorSort: "name_desc" })
      .set("Cookie", authCookie);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Project not found" });
  });

  it("returns project collaborators", async () => {
    const { authCookie, workspaceId, userId } = await createAuthedUserContext();
    const projectId = new mongoose.Types.ObjectId();

    const alice = await createUser({
      workspaceId,
      name: "Alice",
      email: "alice@example.com",
      role: "manager",
      jobTitle: "Product Manager",
      avatarStorageKey: "avatars/alice.png",
    });

    const bob = await createUser({
      workspaceId,
      name: "Bob",
      email: "bob@example.com",
      role: "member",
      jobTitle: "Developer",
    });
    
    await createUser({
      workspaceId,
      name: "Charlie",
      email: "charlie@example.com",
    });

    await createProject({
      _id: projectId,
      workspaceId,
      ownerId: userId.toString(),
      invitedUserIds: [alice._id, bob._id],
    });

    const response = await request(app)
      .get(`/projects/${projectId}/collaborators`)
      .query({ collaboratorsSort: "email_desc", page: 1, limit: 1 })
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({
      items: [
        {
          id: bob._id.toString(),
          name: "Bob",
          email: "bob@example.com",
          jobTitle: "Developer",
          role: "member",
        },
      ],
      pagination: {
        currentPage: 1,
        totalPages: 2,
      },
    });
  });
});
