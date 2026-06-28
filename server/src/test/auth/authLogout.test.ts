import app from "@/app.js";
import request from "supertest";
import { describe, expect, it } from "vitest";

describe("POST /auth/logout", () => {
  it("returns 200 when logout is successful", async () => {
    const response = await request(app).post("/auth/logout");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Logout successful" });
    expect(response.headers["set-cookie"]).toBeDefined();
  });
});
