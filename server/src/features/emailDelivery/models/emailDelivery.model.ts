import mongoose from "mongoose";
import {
  EMAIL_DELIVERY_STATUS,
  EMAIL_DELIVERY_TYPE,
  type EmailDeliveryDocument,
} from "@/features/emailDelivery/types/emailDelivery.document";

const emailDeliverySchema = new mongoose.Schema<EmailDeliveryDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    email: {
      type: String,
      required: true,
      ref: "User",
    },

    encryptedPayload: {
      ciphertext: {
        type: String,
        required: true,
      },
      iv: {
        type: String,
        required: true,
      },
      authTag: {
        type: String,
        required: true,
      },
    },

    status: {
      type: String,
      enum: EMAIL_DELIVERY_STATUS,
      default: "pending",
      required: true,
    },

    type: {
      type: String,
      enum: EMAIL_DELIVERY_TYPE,
      required: true,
    },

    queuedAt: {
      type: Date,
      default: null,
    },

    processingStartedAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

emailDeliverySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const EmailDeliveryModel = mongoose.model<EmailDeliveryDocument>(
  "EmailDelivery",
  emailDeliverySchema,
);
