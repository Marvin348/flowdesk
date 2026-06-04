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
      default: "default",
    },

    role: {
      type: String,
      enum: ["admin", "member", "manager"],
      default: "member",
      required: true,
    },

    jobTitle: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = mongoose.model<UserDocument>("User", userSchema);
