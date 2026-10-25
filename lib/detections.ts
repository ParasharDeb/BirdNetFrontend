import "server-only";

import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import type { DetectionRun, DetectionRow } from "./detection-types";
import { getClient, type S3Config } from "./s3";

const AUDIO_TYPES: Record<string, string> = {
  wav: "audio/wav",
  mp3: "audio/mpeg",
  flac: "audio/flac",
};

const CSV_SUFFIX = ".BirdNET.results.csv";

/** Folder that birdnet_server.py uploads runs into (S3_DETECTIONS_PREFIX, default "detections/"). */
export function detectionsPrefix(): string {
  const raw = process.env.S3_DETECTIONS_PREFIX?.trim().replace(/^\/+/, "") ?? "detections/";
  return raw && !raw.endsWith("/") ? `${raw}/` : raw;
}

/** Splits CSV text into rows of fields, honouring double-quoted fields. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      if (row.some((f) => f !== "")) rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  row.push(field);
  if (row.some((f) => f !== "")) rows.push(row);
  return rows;
}

/** Maps BirdNET's CSV columns (Start (s), End (s), Scientific name, Common name, Confidence) to rows. */
export function parseBirdnetCsv(text: string): DetectionRow[] {
  const [header, ...body] = parseCsv(text);
  if (!header) return [];
  const col = (name: string) => header.findIndex((h) => h.trim().toLowerCase() === name);
  const iStart = col("start (s)");
  const iEnd = col("end (s)");
  const iSci = col("scientific name");
  const iCommon = col("common name");
  const iConf = col("confidence");
  if (iSci < 0 || iConf < 0) return [];
  return body.map((f) => ({
    start: Number(f[iStart]) || 0,
    end: Number(f[iEnd]) || 0,
    scientific: f[iSci] ?? "",
    common: f[iCommon] ?? "",
    confidence: Number(f[iConf]) || 0,
  }));
}

/**
 * Stable link through /api/detections/file, which redirects to a freshly signed URL on every
 * request. Signed URLs expire after an hour; pages left open longer would otherwise stop playing.
 */
function fileUrl(key: string, { download = false }: { download?: boolean } = {}): string {
  const params = new URLSearchParams({ key });
  if (download) params.set("download", "1");
  return `/api/detections/file?${params}`;
}

/** True when `key` is a file inside the detections prefix (guards the file redirect route). */
export function isDetectionKey(key: string): boolean {
  const prefix = detectionsPrefix();
  return key.startsWith(prefix) && !key.endsWith("/") && !key.split("/").includes("..");
}

async function readText(config: S3Config, key: string): Promise<string> {
  const res = await getClient(config).send(new GetObjectCommand({ Bucket: config.bucket, Key: key }));
  return (await res.Body?.transformToString("utf-8")) ?? "";
}

/** All run folders under the prefix, newest first (folder names start with a sortable timestamp). */
async function listRunFolders(config: S3Config, prefix: string): Promise<string[]> {
  const s3 = getClient(config);
  const folders: string[] = [];
  let token: string | undefined;
  do {
    const page = await s3.send(
      new ListObjectsV2Command({ Bucket: config.bucket, Prefix: prefix || undefined, Delimiter: "/", ContinuationToken: token }),
    );
    for (const p of page.CommonPrefixes ?? []) if (p.Prefix) folders.push(p.Prefix);
    token = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (token);
  return folders.sort().reverse();
}

async function loadRun(config: S3Config, folder: string): Promise<DetectionRun> {
  const listing = await getClient(config).send(
    new ListObjectsV2Command({ Bucket: config.bucket, Prefix: folder }),
  );
  const keys = (listing.Contents ?? []).flatMap((o) => (o.Key ? [o.Key] : []));
  const name = (key: string) => key.slice(folder.length);

  const summaryKey = keys.find((k) => name(k) === "result.json");
  const csvKey = keys.find((k) => k.endsWith(CSV_SUFFIX));
  const audioKey = keys.find((k) => AUDIO_TYPES[k.split(".").pop()?.toLowerCase() ?? ""]);

  const [summaryText, csvText] = await Promise.all([
    summaryKey ? readText(config, summaryKey) : Promise.resolve(""),
    csvKey ? readText(config, csvKey) : Promise.resolve(""),
  ]);

  let summary: Record<string, unknown> = {};
  try {
    summary = summaryText ? JSON.parse(summaryText) : {};
  } catch {
    summary = {};
  }
  const rows = csvText ? parseBirdnetCsv(csvText) : [];
  const best = rows.reduce<DetectionRow | null>((a, r) => (!a || r.confidence > a.confidence ? r : a), null);

  return {
    id: folder.slice(0, -1).split("/").pop() ?? folder,
    analyzedAt: typeof summary.analyzedAt === "string" ? summary.analyzedAt : null,
    clip: typeof summary.n === "number" ? summary.n : null,
    species: typeof summary.species === "string" ? summary.species : (best?.common ?? null),
    scientific: typeof summary.scientific === "string" ? summary.scientific : (best?.scientific ?? null),
    confidence: typeof summary.confidence === "number" ? summary.confidence : (best?.confidence ?? 0),
    audio: audioKey
      ? { filename: name(audioKey), contentType: AUDIO_TYPES[audioKey.split(".").pop()!.toLowerCase()], url: fileUrl(audioKey) }
      : null,
    csv: csvKey ? { filename: name(csvKey), url: fileUrl(csvKey, { download: true }) } : null,
    rows,
  };
}

export async function listDetections(
  config: S3Config,
  { cursor, limit }: { cursor: number; limit: number },
): Promise<{ detections: DetectionRun[]; nextCursor: number | null; total: number; prefix: string }> {
  const prefix = detectionsPrefix();
  const folders = await listRunFolders(config, prefix);
  const page = folders.slice(cursor, cursor + limit);
  const detections = await Promise.all(page.map((f) => loadRun(config, f)));
  const next = cursor + page.length;
  return { detections, nextCursor: next < folders.length ? next : null, total: folders.length, prefix };
}
