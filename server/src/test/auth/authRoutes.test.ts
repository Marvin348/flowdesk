import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import {
  clearTestDb,
  conncetTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb.js";
import app from "@/app.js";
import { UserModel } from "@/features/users/models/user.modal.js";
import mongoose from "mongoose";
import { createAccessToken } from "@/features/auth/utils/tokens.js";
import { WorkspaceModel } from "@/features/workspace/models/workspace.model.js";

beforeAll(async () => {
  await conncetTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("GET /auth/me", () => {
  it("returns 200 and the current user when access token is valid", async () => {
    const userId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();

    const workspace = await WorkspaceModel.create({
      _id: workspaceId,
      name: "Test Workspace",
      ownerId: userId,
    });

    const user = await UserModel.create({
      email: "test@example.com",
      name: "Test User",
      passwordHash: "hashed-password",
      workspaceId: workspace._id,
      role: "admin",
    });

    const accessToken = createAccessToken(user._id.toString());

    const response = await request(app)
      .get("/auth/me")
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(200);

    expect(response.body.user).toMatchObject({
      id: user._id.toString(),
      name: "Test User",
      email: "test@example.com",
      avatarKey: "default",
      role: "admin",
      appearanceSettings: {
        theme: "system",
        density: "default",
        startView: "dashboard",
      },
    });
  });

  it("returns 401 when no access token cookie is provided", async () => {
    const response = await request(app).get("/auth/me");

    expect(response.status).toBe(401);
  });

  it("returns 401 when access token is invalid", async () => {
    const response = await request(app)
      .get("/auth/me")
      .set("Cookie", ["accessToken=invalid-token"]);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Not authenticated" });
  });
});

describe("POST /auth/login", () => {
  it("returns 400 when request body is invalid", async () => {
    const response = await request(app).post("/auth/login").send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid request body" });
  });
});

describe("POST /auth/logout", () => {
  it("returns 200 when logout is successful", async () => {
    const response = await request(app).post("/auth/logout");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Logout successful" });
    expect(response.headers["set-cookie"]).toBeDefined();
  });
});

describe("POST /auth/register", () => {
  it("returns 400 when request body is invalid", async () => {
    const response = await request(app).post("/auth/register");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid request body" });
  });
});
