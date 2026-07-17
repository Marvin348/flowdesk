import app from "@/app";
import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import { UserModel } from "@/features/users/models/user.modal";
import mongoose from "mongoose";
import { WorkspaceModel } from "@/features/workspace/models/workspace.model";
import { createAccessToken } from "@/features/auth/utils/tokens";

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("PATCH /users/id", () => {
  it("returns 400 if the userId is not valid", async () => {
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
      passwordHash: "hashed-password",
      workspaceId,
      role: "admin",
      isEmailVerified: true,
    });

    const accessToken = createAccessToken(userId.toString());

    const response = await request(app)
      .patch("/users/invalid-userId")
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid userId" });
  });

  it("returns 400 if the body is invalid", async () => {
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
      passwordHash: "hashed-password",
      workspaceId,
      role: "admin",
      isEmailVerified: true,
    });

    const accessToken = createAccessToken(userId.toString());

    const response = await request(app)
      .patch(`/users/${userId}`)
      .send("test-boy")
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid input" });
  });

  it("allows an admin to change another user's role", async () => {
    const workspaceId = new mongoose.Types.ObjectId();
    const adminId = new mongoose.Types.ObjectId();
    const memberId = new mongoose.Types.ObjectId();

    await WorkspaceModel.create({
      _id: workspaceId,
      name: "Test Workspace",
      ownerId: adminId,
    });

    await UserModel.create([
      {
        _id: adminId,
        email: "admin@example.com",
        name: "Admin User",
        passwordHash: "hashed-password",
        workspaceId,
        role: "admin",
        isEmailVerified: true,
      },
      {
        _id: memberId,
        email: "member@example.com",
        name: "Member User",
        passwordHash: "hashed-password",
        workspaceId,
        role: "member",
        jobTitle: "Developer",
        isEmailVerified: true,
      },
    ]);

    const accessToken = createAccessToken(adminId.toString());

    const response = await request(app)
      .patch(`/users/${memberId}`)
      .send({ role: "manager" })
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({
      id: memberId.toString(),
      name: "Member User",
      email: "member@example.com",
      jobTitle: "Developer",
      role: "manager",
    });

    const updatedMember = await UserModel.findById(memberId).lean();
    expect(updatedMember?.role).toBe("manager");
  });

  it("does not allow a non-admin to change another user's role", async () => {
    const workspaceId = new mongoose.Types.ObjectId();
    const ownerId = new mongoose.Types.ObjectId();
    const memberId = new mongoose.Types.ObjectId();
    const targetUserId = new mongoose.Types.ObjectId();

    await WorkspaceModel.create({
      _id: workspaceId,
      name: "Test Workspace",
      ownerId,
    });

    await UserModel.create([
      {
        _id: ownerId,
        email: "admin@example.com",
        name: "Admin User",
        passwordHash: "hashed-password",
        workspaceId,
        role: "admin",
        isEmailVerified: true,
      },
      {
        _id: memberId,
        email: "member@example.com",
        name: "Member User",
        passwordHash: "hashed-password",
        workspaceId,
        role: "member",
        isEmailVerified: true,
      },
      {
        _id: targetUserId,
        email: "target@example.com",
        name: "Target User",
        passwordHash: "hashed-password",
        workspaceId,
        role: "member",
        isEmailVerified: true,
      },
    ]);

    const accessToken = createAccessToken(memberId.toString());

    const response = await request(app)
      .patch(`/users/${targetUserId}`)
      .send({ role: "admin" })
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "Only admins can change user roles",
    });

    const unchangedTarget = await UserModel.findById(targetUserId).lean();
    expect(unchangedTarget?.role).toBe("member");
  });

  it("does not allow an admin to demote themselves", async () => {
    const workspaceId = new mongoose.Types.ObjectId();
    const adminId = new mongoose.Types.ObjectId();

    await WorkspaceModel.create({
      _id: workspaceId,
      name: "Test Workspace",
      ownerId: adminId,
    });

    await UserModel.create({
      _id: adminId,
      email: "admin@example.com",
      name: "Admin User",
      passwordHash: "hashed-password",
      workspaceId,
      role: "admin",
      isEmailVerified: true,
    });

    const accessToken = createAccessToken(adminId.toString());

    const response = await request(app)
      .patch(`/users/${adminId}`)
      .send({ role: "member" })
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "Admins cannot demote themselves",
    });

    const unchangedAdmin = await UserModel.findById(adminId).lean();
    expect(unchangedAdmin?.role).toBe("admin");
  });
});
