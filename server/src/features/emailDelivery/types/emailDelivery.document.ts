import { Types } from "mongoose";

export type EmailDeliveryDocument = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  email: string;
  encryptedPayload: EncryptedPayload;
  status: EmailDeliveryStatus;
  type: EmailDeliveryType;
  processingStartedAt: Date | null;
  queuedAt: Date | null;
  expiresAt: Date;
  createdAt: Date;
};

export const EMAIL_DELIVERY_STATUS = [
  "pending",
  "processing",
  "sent",
  "cancelled",
] as const;
type EmailDeliveryStatus = (typeof EMAIL_DELIVERY_STATUS)[number];

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  authTag: string;
}

export type EmailDeliveryType = (typeof EMAIL_DELIVERY_TYPE)[number];

export const EMAIL_DELIVERY_TYPE = [
  "account-verification",
  "email_change",
  "password_change",
] as const;
