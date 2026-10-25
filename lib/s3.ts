import "server-only";

import { GetObjectCommand, ListObjectsV2Command, S3Client, S3ServiceException } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { GalleryImage, ImagesErrorCode } from "./gallery-types";

const IMAGE_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

export const PRESIGN_TTL_SECONDS = 60 * 60;

export type S3Config = {
  region: string;
  bucket: string;
  prefix: string;
  publicBaseUrl: string | null;
  /** S3-compatible endpoint (e.g. Supabase Storage); null for Amazon S3. */
  endpoint: string | null;
};

/** Reads configuration from server-only env vars. Returns null when the bucket is not configured. */
export function getS3Config(): S3Config | null {
  const region = process.env.AWS_REGION?.trim();
  const bucket = process.env.S3_BUCKET_NAME?.trim();
  if (!region || !bucket) return null;
  const prefix = process.env.S3_IMAGE_PREFIX?.trim().replace(/^\/+/, "") ?? "";
  const publicBaseUrl = process.env.S3_PUBLIC_BASE_URL?.trim().replace(/\/+$/, "") || null;
  const endpoint = process.env.S3_ENDPOINT?.trim().replace(/\/+$/, "") || null;
  return { region, bucket, prefix, publicBaseUrl, endpoint };
}

let client: S3Client | null = null;
let clientKey: string | null = null;

/**
 * Credentials resolve through the SDK default provider chain: AWS_ACCESS_KEY_ID /
 * AWS_SECRET_ACCESS_KEY env vars locally, or an IAM role / OIDC web identity when deployed.
 */
export function getClient(config: Pick<S3Config, "region" | "endpoint">): S3Client {
  const key = `${config.region}|${config.endpoint ?? ""}`;
  if (!client || clientKey !== key) {
    // S3-compatible stores like Supabase need path-style URLs.
    client = config.endpoint
      ? new S3Client({ region: config.region, endpoint: config.endpoint, forcePathStyle: true })
      : new S3Client({ region: config.region });
    clientKey = key;
  }
  return client;
}

export function imageContentType(key: string): string | null {
  const ext = key.split(".").pop()?.toLowerCase() ?? "";
  return IMAGE_TYPES[ext] ?? null;
}

/** Public URL when S3_PUBLIC_BASE_URL is set, otherwise a presigned GET valid for PRESIGN_TTL_SECONDS. */
export async function objectUrl(
  config: S3Config,
  key: string,
  { downloadAs }: { downloadAs?: string } = {},
): Promise<string> {
  if (config.publicBaseUrl) {
    return `${config.publicBaseUrl}/${key.split("/").map(encodeURIComponent).join("/")}`;
  }
  const command = new GetObjectCommand({
    Bucket: config.bucket,
    Key: key,
    ResponseContentDisposition: downloadAs ? `attachment; filename="${downloadAs.replace(/"/g, "")}"` : undefined,
  });
  return getSignedUrl(getClient(config), command, {
    expiresIn: PRESIGN_TTL_SECONDS,
  });
}

export async function listImages(
  config: S3Config,
  { token, limit }: { token?: string; limit: number },
): Promise<{ images: GalleryImage[]; nextToken: string | null }> {
  const s3 = getClient(config);
  const result = await s3.send(
    new ListObjectsV2Command({
      Bucket: config.bucket,
      Prefix: config.prefix || undefined,
      ContinuationToken: token,
      MaxKeys: limit,
    }),
  );

  const objects = (result.Contents ?? []).flatMap((obj) => {
    const key = obj.Key;
    if (!key || key.endsWith("/")) return []; // folder placeholders
    const contentType = imageContentType(key);
    if (!contentType) return []; // non-image files
    return [{ key, contentType, size: obj.Size ?? 0, lastModified: obj.LastModified ?? null }];
  });

  const expiresAt = new Date(Date.now() + PRESIGN_TTL_SECONDS * 1000).toISOString();
  const images = await Promise.all(
    objects.map(async (obj): Promise<GalleryImage> => {
      const url = await objectUrl(config, obj.key);
      return {
        key: obj.key,
        filename: obj.key.split("/").pop() ?? obj.key,
        size: obj.size,
        lastModified: obj.lastModified?.toISOString() ?? null,
        contentType: obj.contentType,
        url,
        expiresAt: config.publicBaseUrl ? null : expiresAt,
      };
    }),
  );

  return {
    images,
    nextToken: result.IsTruncated ? (result.NextContinuationToken ?? null) : null,
  };
}

/** Maps AWS SDK failures to a stable error code + safe message (no internals leaked). */
export function describeS3Error(err: unknown): { status: number; code: ImagesErrorCode; message: string } {
  const name = err instanceof S3ServiceException || err instanceof Error ? err.name : "";
  const status = err instanceof S3ServiceException ? err.$metadata.httpStatusCode : undefined;

  if (name === "NoSuchBucket") {
    return { status: 502, code: "BUCKET_NOT_FOUND", message: "The configured S3 bucket does not exist." };
  }
  if (name === "AccessDenied" || name === "InvalidAccessKeyId" || name === "SignatureDoesNotMatch" || status === 403) {
    return {
      status: 502,
      code: "ACCESS_DENIED",
      message: "The server's AWS credentials cannot list this bucket (needs s3:ListBucket and s3:GetObject).",
    };
  }
  if (name === "CredentialsProviderError") {
    return { status: 500, code: "NOT_CONFIGURED", message: "No AWS credentials are available to the server." };
  }
  if (name === "InvalidArgument" && status === 400) {
    return { status: 400, code: "INVALID_TOKEN", message: "The pagination token is invalid or expired." };
  }
  return { status: 502, code: "AWS_ERROR", message: "Could not reach Amazon S3. Please try again." };
}
