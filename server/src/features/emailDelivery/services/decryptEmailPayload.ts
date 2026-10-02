import crypto from "node:crypto";
import { EncryptedPayload } from "@/features/emailDelivery/types/emailDelivery.document";

export const decryptEmailPayload = (
  encryptedPayload: EncryptedPayload,
): string => {
  const encryptionKey = Buffer.from(
    process.env.EMAIL_PAYLOAD_ENCRYPTION_KEY!,
    "hex",
  );

  if (encryptionKey.length !== 32) {
    throw new Error("Invalid email encryption key");
  }

  const iv = Buffer.from(encryptedPayload.iv, "base64");

  const authTag = Buffer.from(encryptedPayload.authTag, "base64");

  const ciphertext = Buffer.from(encryptedPayload.ciphertext, "base64");

  const decipher = crypto.createDecipheriv("aes-256-gcm", encryptionKey, iv);

  decipher.setAuthTag(authTag);

  const rawToken = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return rawToken.toString("utf8");
};
