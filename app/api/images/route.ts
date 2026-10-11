import type { NextRequest } from "next/server";
import type { ImagesErrorCode, ImagesErrorResponse, ImagesResponse } from "@/lib/gallery-types";
import { describeS3Error, getS3Config, listImages } from "@/lib/s3";

const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 100;

function errorResponse(status: number, code: ImagesErrorCode, message: string) {
  return Response.json({ error: { code, message } } satisfies ImagesErrorResponse, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

/**
 * GET /api/images?limit=24&token=<continuationToken>
 * Lists one page of image objects from the configured S3 bucket with short-lived URLs.
 */
export async function GET(request: NextRequest) {
  const config = getS3Config();
  if (!config) {
    return errorResponse(
      500,
      "NOT_CONFIGURED",
      "S3 is not configured. Set AWS_REGION and S3_BUCKET_NAME on the server.",
    );
  }

  const params = request.nextUrl.searchParams;
  const rawLimit = params.get("limit");
  const limit = rawLimit === null ? DEFAULT_LIMIT : Number(rawLimit);
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
    return errorResponse(400, "BAD_REQUEST", `limit must be an integer between 1 and ${MAX_LIMIT}.`);
  }
  const token = params.get("token") || undefined;
  if (token && token.length > 1024) {
    return errorResponse(400, "INVALID_TOKEN", "The pagination token is invalid.");
  }

  try {
    const { images, nextToken } = await listImages(config, { token, limit });
    const body: ImagesResponse = { images, nextToken, bucket: config.bucket, prefix: config.prefix };
    // Presigned URLs are per-request secrets with an expiry: never cache in shared caches.
    return Response.json(body, { headers: { "Cache-Control": "private, no-store" } });
  } catch (err) {
    const { status, code, message } = describeS3Error(err);
    console.error("[api/images] S3 list failed:", err instanceof Error ? `${err.name}: ${err.message}` : err);
    return errorResponse(status, code, message);
  }
}
