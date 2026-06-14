import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "@/app.js";

describe("GET /auth/me", () => {
  it("returns 401 when no access token cookie is provided", async () => {
    const response = await request(app).get("/auth/me");

    expect(response.status).toBe(401);
  });
});
