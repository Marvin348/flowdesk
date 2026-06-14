import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "@/app.js";

describe("GET /auth/me", () => {
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
