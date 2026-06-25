import mongoose from "mongoose";
import {
  VERIFICATION_TOKEN_TYPE,
  VerificationTokenDocument,
} from "@/features/verification-tokens/types/verificationToken.document.js";

const verificationTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tokenHash: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: VERIFICATION_TOKEN_TYPE,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    usedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const VerificationTokenModel = mongoose.model<VerificationTokenDocument>(
  "VerificationToken",
  verificationTokenSchema,
);
