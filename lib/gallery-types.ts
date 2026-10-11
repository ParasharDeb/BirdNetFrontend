/** Shared between the /api/images route handler and the gallery client. */

export type GalleryImage = {
  key: string;
  filename: string;
  size: number;
  lastModified: string | null;
  contentType: string;
  /** Short-lived presigned GET URL (or public URL when S3_PUBLIC_BASE_URL is set). */
  url: string;
  /** ISO timestamp after which `url` stops working; null for public URLs. */
  expiresAt: string | null;
};

export type ImagesResponse = {
  images: GalleryImage[];
  nextToken: string | null;
  bucket: string;
  prefix: string;
};

export type ImagesErrorCode =
  | "NOT_CONFIGURED"
  | "ACCESS_DENIED"
  | "BUCKET_NOT_FOUND"
  | "INVALID_TOKEN"
  | "BAD_REQUEST"
  | "AWS_ERROR";

export type ImagesErrorResponse = {
  error: { code: ImagesErrorCode; message: string };
};
