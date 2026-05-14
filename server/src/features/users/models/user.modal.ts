import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: {
      // id gets removed later
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
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

export const UserModel = mongoose.model("User", userSchema);
