import type { NextRequest } from "next/server";
import type { DetectionsErrorResponse, DetectionsResponse } from "@/lib/detection-types";
import type { ImagesErrorCode } from "@/lib/gallery-types";
import { listDetections } from "@/lib/detections";
import { describeS3Error, getS3Config } from "@/lib/s3";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

function errorResponse(status: number, code: ImagesErrorCode, message: string) {
  return Response.json({ error: { code, message } } satisfies DetectionsErrorResponse, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

/**
 * GET /api/detections?limit=12&cursor=0
 * Lists BirdNET runs (clip + CSV + result.json) uploaded by birdnet_server.py, newest first.
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
  const rawCursor = params.get("cursor");
  const cursor = rawCursor === null ? 0 : Number(rawCursor);
  if (!Number.isInteger(cursor) || cursor < 0) {
    return errorResponse(400, "INVALID_TOKEN", "cursor must be a non-negative integer.");
  }

  try {
    const { detections, nextCursor, total, prefix } = await listDetections(config, { cursor, limit });
    const body: DetectionsResponse = { detections, nextCursor, total, bucket: config.bucket, prefix };
    // Presigned URLs are per-request secrets with an expiry: never cache in shared caches.
    return Response.json(body, { headers: { "Cache-Control": "private, no-store" } });
  } catch (err) {
    const { status, code, message } = describeS3Error(err);
    console.error("[api/detections] S3 read failed:", err instanceof Error ? `${err.name}: ${err.message}` : err);
    return errorResponse(status, code, message);
  }
}
