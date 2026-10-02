import crypto from "node:crypto";

export const encryptEmailPayload = (rawToken: string) => {
  const iv = crypto.randomBytes(12);

  const encryptionKey = Buffer.from(
    process.env.EMAIL_PAYLOAD_ENCRYPTION_KEY!,
    "hex",
  );

  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey, iv);

  const ciphertext = Buffer.concat([
    cipher.update(rawToken, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return {
    ciphertext: ciphertext.toString("base64"),
    iv: iv.toString("base64"),
    authTag: authTag.toString("base64"),
  };
};
