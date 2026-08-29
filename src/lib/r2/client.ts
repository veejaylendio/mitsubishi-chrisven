import { S3Client } from "@aws-sdk/client-s3";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export function getR2Client() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${requireEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
    },
  });
}

export function getR2Bucket(): string {
  return requireEnv("R2_BUCKET_NAME");
}

/** Path prefix for the route that proxies R2 objects (see src/app/api/images/[...key]/route.ts). */
export const IMAGE_PROXY_PREFIX = "/api/images/";

/**
 * Returns a URL our own app serves the object from, rather than R2's public
 * bucket URL — this works without depending on R2's Public Development URL
 * (which is rate-limited/unreliable) or a custom domain being set up.
 */
export function publicUrlFor(key: string): string {
  return `${IMAGE_PROXY_PREFIX}${key}`;
}
