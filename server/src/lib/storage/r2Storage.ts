import crypto from "node:crypto";
import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { r2Client } from "@/lib/storage/r2Client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AppError } from "@/utils/AppError";

type FileBucket = "private" | "public";
type Prefix = "attachments" | "avatars";

type UploadFileToR2Options = {
  bucket: FileBucket;
  prefix: Prefix;
};

type DeleteFileFromR2Options = {
  bucket: FileBucket;
  storageKey: string;
};

export const uploadFileToR2 = async (
  file: Express.Multer.File,
  options: UploadFileToR2Options,
) => {
  const fileExtention = file.originalname.split(".").pop();

  const storageKey = `${options.prefix}/${crypto.randomUUID()}.${fileExtention}`;

  const bucketName =
    options.bucket === "private"
      ? process.env.R2_PRIVATE_BUCKET_NAME
      : process.env.R2_PUBLIC_BUCKET_NAME;

  if (!bucketName) {
    throw new AppError(
      `Missing R2 bucket env for ${options.bucket} bucket`,
      400,
    );
  }

  await r2Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: storageKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );

  return storageKey;
};

export const deleteFileFromR2 = async ({
  storageKey,
  bucket,
}: DeleteFileFromR2Options) => {
  const bucketName =
    bucket === "private"
      ? process.env.R2_PRIVATE_BUCKET_NAME
      : process.env.R2_PUBLIC_BUCKET_NAME;

  if (!bucketName) {
    throw new AppError(`Missing R2 bucket env for ${bucket} bucket`, 400);
  }

  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: storageKey,
    }),
  );
};

export const createSignedDownloadUrl = async (storageKey: string) => {
  return getSignedUrl(
    r2Client,
    new GetObjectCommand({
      Bucket: process.env.R2_PRIVATE_BUCKET_NAME!,
      Key: storageKey,
    }),
    { expiresIn: 60 },
  );
};
