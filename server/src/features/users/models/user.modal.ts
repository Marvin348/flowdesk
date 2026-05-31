import mongoose from "mongoose";
import type { UserDocument } from "@/features/users/types/user.document.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    avatarKey: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "member", "manager"],
      required: true,
    },

    jobTitle: {
      type: String,
      enum: [
        "Frontend Developer",
        "Designer",
        "Project Manager",
        "Backend Developer",
        "Art Director",
        "Fullstack Developer",
        "DevOps Engineer",
        "QA Engineer",
        "Motion Designer",
      ],
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = mongoose.model<UserDocument>("User", userSchema);
