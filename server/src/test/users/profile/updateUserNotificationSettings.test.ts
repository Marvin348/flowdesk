import app from "@/app";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import request from "supertest";
import { createAuthedUserContext } from "@/test/helpers/testFactories";
import { UserModel } from "@/features/users/models/user.modal";

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("PATCH /users/me/notification-settings", () => {
  it("returns 401 if the user is not authenticated", async () => {
    const response = await request(app)
      .patch("/users/me/notification-settings")
      .send({ assignments: false });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Not authenticated" });
  });

  it("returns 400 if no notification setting is provided", async () => {
    const { authCookie } = await createAuthedUserContext();

    const response = await request(app)
      .patch("/users/me/notification-settings")
      .send({})
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid notification settings" });
  });

  it("returns 400 if an unknown notification key is provided", async () => {
    const { authCookie } = await createAuthedUserContext();

    const response = await request(app)
      .patch("/users/me/notification-settings")
      .send({ test: false })
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid notification settings" });
  });

  it("returns 400 if a notification setting is not a boolean", async () => {
    const { authCookie } = await createAuthedUserContext();

    const response = await request(app)
      .patch("/users/me/notification-settings")
      .send({ comments: "false" })
      .set("Cookie", authCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid notification settings" });
  });

  it("returns 200 and updates a single notification setting", async () => {
    const { authCookie, userId } = await createAuthedUserContext();

    const response = await request(app)
      .patch("/users/me/notification-settings")
      .send({ assignments: false })
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Updated Notification settings successful",
    });

    const updatedUser = await UserModel.findById(userId).lean();

    expect(updatedUser?.settings.notifications).toMatchObject({
      assignments: false,
      comments: true,
      deadlines: true,
    });
  });

  it("returns 200 and updates multiple notification settings while preserving omitted settings", async () => {
    const { authCookie, userId } = await createAuthedUserContext();

    await UserModel.findByIdAndUpdate(userId, {
      $set: {
        "settings.notifications.assignments": false,
        "settings.notifications.comments": true,
        "settings.notifications.deadlines": false,
      },
    });

    const response = await request(app)
      .patch("/users/me/notification-settings")
      .send({ comments: false, deadlines: true })
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);

    const updatedUser = await UserModel.findById(userId).lean();

    expect(updatedUser?.settings.notifications).toMatchObject({
      assignments: false,
      comments: false,
      deadlines: true,
    });
  });
});
