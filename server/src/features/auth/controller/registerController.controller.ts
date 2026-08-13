import type { Request, Response } from "express";
import { registerSchema } from "@/features/auth/validators/auth.validators";
import { AppError } from "@/utils/AppError";
import { registerUser } from "@/features/auth/services/auth.service";

export const registerController = async (req: Request, res: Response) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError("Invalid request body", 400);
  }

  const input = result.data;

  await registerUser(input);

  return res
    .status(201)
    .json({ message: "Registration successful. Please check your email." });
};
