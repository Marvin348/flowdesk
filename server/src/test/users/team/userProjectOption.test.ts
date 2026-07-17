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
} from "@/test/helpers/testFactories";
import { bulidPublicFileUrl } from "@/utils/bulidPublicFileUrl";

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("GET /users/project-options", () => {
  it("returns 404 if the user was not found", async () => {
    const { authCookie } = await createAuthedUserContext();
    const missingUserId = new mongoose.Types.ObjectId().toString();

    const response = await request(app)
      .get("/users/project-options")
      .query({ search: "", userId: missingUserId })
      .set("Cookie", authCookie);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Selected user not found" });
  });

  it("returns empty project options if the workspace has no projects", async () => {
    const { authCookie, user } = await createAuthedUserContext();

    const response = await request(app)
      .get("/users/project-options")
      .query({ search: "", userId: user._id.toString() })
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        recent: [],
        results: [],
      },
    });
  });

  it("returns project options of the selectedUser", async () => {
    const { authCookie, userId, user, workspaceId } =
      await createAuthedUserContext();

    const project = await createProject({
      workspaceId,
      title: "Website Relaunch",
      invitedUserIds: [userId],
      dueDate: "2026-07-11T12:36:00.000Z",
    });

    const response = await request(app)
      .get("/users/project-options")
      .query({ search: "", userId: user._id.toString() })
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        recent: [
          {
            id: project._id.toString(),
            title: "Website Relaunch",
            isInvited: true,
            createdAt: project.createdAt.toISOString(),
            users: [
              {
                id: user._id.toString(),
                ...(user.avatarKey && { avatarKey: user.avatarKey }),
                ...(user.avatarStorageKey && {
                  avatarUrl: bulidPublicFileUrl(user.avatarStorageKey),
                }),
              },
            ],
          },
        ],
        results: [],
      },
    });
  });
});
