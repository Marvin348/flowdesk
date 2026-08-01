import mongoose from "mongoose";
import type { UserDocument } from "@/features/users/types/user.document";
import {
  APPEARANCE_DENSITIES,
  APPEARANCE_START_VIEWS,
  APPEARANCE_THEMES,
} from "@shared/types/user";

const userSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

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
    },

    avatarStorageKey: {
      type: String,
    },

    role: {
      type: String,
      enum: ["member", "manager", "admin"],
      default: "member",
      required: true,
    },

    jobTitle: {
      type: String,
    },

    isEmailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },

    passwordChangedAt: {
      type: Date,
      default: null,
    },

    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },

    emailVerifiedAt: {
      type: Date,
    },

    settings: {
      appearance: {
        theme: {
          type: String,
          enum: APPEARANCE_THEMES,
          default: "system",
        },
        density: {
          type: String,
          enum: APPEARANCE_DENSITIES,
          default: "default",
        },
        startView: {
          type: String,
          enum: APPEARANCE_START_VIEWS,
          default: "dashboard",
        },
      },

      notifications: {
        assignments: {
          type: Boolean,
          default: true,
        },
        comments: {
          type: Boolean,
          default: true,
        },
        deadlines: {
          type: Boolean,
          default: true,
        },
      },
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = mongoose.model<UserDocument>("User", userSchema);
