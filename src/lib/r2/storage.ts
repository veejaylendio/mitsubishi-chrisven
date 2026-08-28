import {
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getR2Bucket, getR2Client, publicUrlFor } from "./client";

/**
 * Uploads a file to R2 from the server (route handler / server action) and
 * returns its public URL. Suited to small files; for anything that might
 * exceed the Server Action body limit, use getPresignedUploadUrl instead so
 * the browser uploads directly to R2.
 */
export async function uploadImage(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string
): Promise<string> {
  await getR2Client().send(
    new PutObjectCommand({
      Bucket: getR2Bucket(),
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  return publicUrlFor(key);
}

/** Returns a short-lived URL the browser can PUT a file to directly. */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresInSeconds = 300
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: getR2Bucket(),
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(getR2Client(), command, { expiresIn: expiresInSeconds });
}

export async function deleteImage(key: string): Promise<void> {
  await getR2Client().send(
    new DeleteObjectCommand({ Bucket: getR2Bucket(), Key: key })
  );
}

/** Extracts the object key from a public R2 URL produced by publicUrlFor. */
export function keyFromPublicUrl(url: string): string | null {
  const base = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
  if (!base || !url.startsWith(`${base}/`)) return null;
  return url.slice(base.length + 1);
}
