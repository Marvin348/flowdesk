import app from "@/app";
import { UserModel } from "@/features/users/models/user.modal";
import { WorkspaceModel } from "@/features/workspace/models/workspace.model";
import { createAuthCookie } from "@/test/helpers/testFactories";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import mongoose from "mongoose";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

const createTestUser = async () => {
  const userId = new mongoose.Types.ObjectId();
  const workspaceId = new mongoose.Types.ObjectId();

  await WorkspaceModel.create({
    _id: workspaceId,
    name: "Test Workspace",
    ownerId: userId,
  });

  await UserModel.create({
    _id: userId,
    email: "test@example.com",
    name: "Test User",
    jobTitle: "Developer",
    passwordHash: "hashed-password",
    workspaceId,
    role: "admin",
    isEmailVerified: true,
  });

  return {
    userId,
    authCookie: await createAuthCookie(userId),
  };
};

describe("PATCH /users/me", () => {
  it("returns 401 if the user is not authenticated", async () => {
    const response = await request(app)
      .patch("/users/me")
      .send({ name: "Updated User" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Not authenticated" });
  });

  it("returns 400 if no profile field is provided", async () => {
    const { authCookie } = await createTestUser();

    const response = await request(app)
      .patch("/users/me")
      .send({})
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid profile data" });
  });

  it("returns 400 if the name is too short", async () => {
    const { authCookie } = await createTestUser();

    const response = await request(app)
      .patch("/users/me")
      .send({ name: "A" })
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid profile data" });
  });

  it("returns 400 if the job title is too long", async () => {
    const { authCookie } = await createTestUser();

    const response = await request(app)
      .patch("/users/me")
      .send({ jobTitle: "A".repeat(31) })
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid profile data" });
  });

  it("does not allow email or role to be updated through the profile route", async () => {
    const { userId, authCookie } = await createTestUser();

    const response = await request(app)
      .patch("/users/me")
      .send({ email: "other@example.com", role: "member" })
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);

    const unchangedUser = await UserModel.findById(userId);
    expect(unchangedUser?.email).toBe("test@example.com");
    expect(unchangedUser?.role).toBe("admin");
  });

  it("returns 201 and updates name and job title", async () => {
    const { userId, authCookie } = await createTestUser();

    const response = await request(app)
      .patch("/users/me")
      .send({ name: "  Updated User  ", jobTitle: "  Product Manager  " })
      .set("Cookie", authCookie);

    expect(response.status).toBe(201);
    expect(response.body.user).toEqual({
      id: userId.toString(),
      name: "Updated User",
      email: "test@example.com",
      jobTitle: "Product Manager",
      role: "admin",
    });

    const updatedUser = await UserModel.findById(userId);
    expect(updatedUser?.name).toBe("Updated User");
    expect(updatedUser?.jobTitle).toBe("Product Manager");
  });

  it("returns 201 and only updates the provided profile field", async () => {
    const { userId, authCookie } = await createTestUser();

    const response = await request(app)
      .patch("/users/me")
      .send({ name: "Renamed User" })
      .set("Cookie", authCookie);

    expect(response.status).toBe(201);

    const updatedUser = await UserModel.findById(userId);
    expect(updatedUser?.name).toBe("Renamed User");
    expect(updatedUser?.jobTitle).toBe("Developer");
    expect(updatedUser?.email).toBe("test@example.com");
    expect(updatedUser?.role).toBe("admin");
  });
});
