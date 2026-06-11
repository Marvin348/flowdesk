import crypto from "node:crypto";
import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { r2Client } from "@/lib/r2Client.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const uploadFileToR2 = async (file: Express.Multer.File) => {
  const fileExtention = file.originalname.split(".").pop();

  const storageKey = `attachments/${crypto.randomUUID()}.${fileExtention}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: storageKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );

  return storageKey;
};

export const deleteFileFromR2 = async (storageKey: string) => {
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: storageKey,
    }),
  );
};

export const createSignedDownloadUrl = async (storageKey: string) => {
  return getSignedUrl(
    r2Client,
    new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: storageKey,
    }),
    { expiresIn: 60 },
  );
};
