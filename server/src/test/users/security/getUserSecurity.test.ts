import app from "@/app";
import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import { createAuthedUserContext } from "@/test/helpers/testFactories";

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("GET /users/me/security", () => {
  it("returns 401 when the user is not authenticated", async () => {
    const response = await request(app).get("/users/me/security");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Not authenticated" });
  });

  it("returns the security overview for the authenticated user", async () => {
    const { authCookie, user } = await createAuthedUserContext({
      email: "security@example.com",
    });

    const response = await request(app)
      .get("/users/me/security")
      .set("Cookie", authCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      user: {
        email: user.email,
        isEmailVerified: true,
        passwordChangedAt: null,
        twoFactorEnabled: false,
      },
    });
  });
});
