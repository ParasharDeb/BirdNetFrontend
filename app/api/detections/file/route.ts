import type { NextRequest } from "next/server";
import { isDetectionKey } from "@/lib/detections";
import { getS3Config, objectUrl } from "@/lib/s3";

/**
 * GET /api/detections/file?key=detections/<run>/<file>[&download=1]
 * Redirects to a freshly signed URL for one file of a BirdNET run, so audio players and
 * download links on the detections page keep working however long the page stays open.
 */
export async function GET(request: NextRequest) {
  const config = getS3Config();
  if (!config) {
    return new Response("S3 is not configured.", { status: 500 });
  }

  const params = request.nextUrl.searchParams;
  const key = params.get("key") ?? "";
  if (!isDetectionKey(key)) {
    return new Response("Unknown detection file.", { status: 400 });
  }

  const downloadAs = params.get("download") === "1" ? key.split("/").pop() : undefined;
  const url = await objectUrl(config, key, { downloadAs });
  return new Response(null, {
    status: 302,
    headers: { Location: url, "Cache-Control": "private, no-store" },
  });
}
