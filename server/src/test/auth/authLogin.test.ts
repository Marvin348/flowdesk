import app from "@/app.js";
import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb.js";
import { UserModel } from "@/features/users/models/user.modal.js";
import mongoose from "mongoose";
import { WorkspaceModel } from "@/features/workspace/models/workspace.model.js";
import bcrypt from "bcryptjs";

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});


describe("POST /auth/login", () => {
  it("returns 200 when the login was successful", async () => {
    const userId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();

    await WorkspaceModel.create({
      _id: workspaceId,
      name: "Test Workspace",
      ownerId: userId,
    });

    const password = "Password123!";
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      _id: userId,
      email: "test@example.com",
      name: "Test User",
      passwordHash,
      workspaceId,
      role: "admin",
      isEmailVerified: true,
    });

    const response = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password,
    });

    expect(response.status).toBe(200);

    expect(response.headers["set-cookie"]).toBeDefined();

    expect(response.body.user).toMatchObject({
      id: user._id.toString(),
      name: "Test User",
      email: "test@example.com",
      role: "admin",
    });
  });

  it("returns 400 when request body is invalid", async () => {
    const response = await request(app).post("/auth/login").send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid request body" });
  });

  it("return 403 when the email is not verified", async () => {
    const userId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();
    const password = "Password123!";
    const passwordHash = await bcrypt.hash(password, 10);

    await WorkspaceModel.create({
      _id: workspaceId,
      name: "Test Workspace",
      ownerId: userId,
    });

    await UserModel.create({
      _id: userId,
      email: "test@example.com",
      name: "Test User",
      passwordHash,
      workspaceId,
      role: "admin",
      isEmailVerified: false,
    });

    const response = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password,
    });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "Please verify your email first.",
    });
    expect(response.headers["set-cookie"]).toBeUndefined();
  });

  it("returns 401 when the password is incorrect", async () => {
    const userId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();
    const passwordHash = await bcrypt.hash("Password123!", 10);

    await WorkspaceModel.create({
      _id: workspaceId,
      name: "Test Workspace",
      ownerId: userId,
    });

    await UserModel.create({
      _id: userId,
      email: "test@example.com",
      name: "Test User",
      passwordHash,
      workspaceId,
      role: "admin",
      isEmailVerified: true,
    });

    const response = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password: "WrongPassword123!",
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Invalid credentials" });
    expect(response.headers["set-cookie"]).toBeUndefined();
  });
});
