import type { CookieOptions } from "express";

const isProduction = process.env.NODE_ENV === "production";

export const authCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};
