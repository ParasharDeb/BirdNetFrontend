/** Shared between the /api/detections route handler and the detections client. */

import type { ImagesErrorCode } from "./gallery-types";

/** One row of a BirdNET results CSV. */
export type DetectionRow = {
  start: number;
  end: number;
  scientific: string;
  common: string;
  confidence: number;
};

/** One BirdNET run uploaded by birdnet_server.py: a folder with the clip, the CSV and result.json. */
export type DetectionRun = {
  /** Folder name, e.g. "2026-10-25T14-03-12_clip7". */
  id: string;
  analyzedAt: string | null;
  clip: number | null;
  /** Top detection; null when BirdNET found nothing above its threshold. */
  species: string | null;
  scientific: string | null;
  confidence: number;
  audio: { filename: string; contentType: string; url: string } | null;
  csv: { filename: string; url: string } | null;
  rows: DetectionRow[];
};

export type DetectionsResponse = {
  detections: DetectionRun[];
  /** Offset of the next page, or null when there are no more runs. */
  nextCursor: number | null;
  total: number;
  bucket: string;
  prefix: string;
};

export type DetectionsErrorResponse = {
  error: { code: ImagesErrorCode; message: string };
};
