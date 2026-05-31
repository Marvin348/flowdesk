import express from "express";
import {
  loginSchema,
  registerSchema,
} from "@/features/auth/validators/auth.validators.js";
import {
  loginUser,
  registerUser,
} from "@/features/auth/services/auth.service.js";
import { verifyAccessToken } from "@/features/auth/utils/tokens.js";
import { UserModel } from "@/features/users/models/user.modal.js";
import { toUserDto } from "@/features/users/mappers/user.mapper.js";

const router = express.Router();

router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const payload = verifyAccessToken(token);

    if (typeof payload === "string" || !payload.sub) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userId = payload.sub;

    const user = await UserModel.findById(userId).lean();

    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    return res.status(200).json({ user: toUserDto(user) });
  } catch (error) {
    return res.status(401).json({ message: "Not authenticated" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const input = result.data;

    const { user, accessToken } = await loginUser(input);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    });

    return res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({ message: "Logout successful" });
});

router.post("/register", async (req, res) => {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const input = result.data;

    const { user, accessToken } = await registerUser(input);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    });

    return res.status(201).json({ message: "Register successful", user });
  } catch (error) {
    if (error instanceof Error && error.message === "Email already exists") {
      return res.status(409).json({ message: "Email already exists" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
