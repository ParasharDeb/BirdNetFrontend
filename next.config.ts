import type { NextConfig } from "next";

type RemotePattern = NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>[number];

/**
 * Only the configured bucket (and an optional public base URL / CDN in front of it) may be
 * optimized by next/image. Read at build/start time — redeploy after changing these env vars.
 */
function galleryImagePatterns(): RemotePattern[] {
  const patterns: RemotePattern[] = [];
  const bucket = process.env.S3_BUCKET_NAME?.trim();
  const region = process.env.AWS_REGION?.trim();
  const endpoint = process.env.S3_ENDPOINT?.trim();
  if (bucket && region) {
    const prefix = process.env.S3_IMAGE_PREFIX?.trim().replace(/^\/+|\/+$/g, "");
    if (endpoint) {
      // S3-compatible store (e.g. Supabase): path-style URLs, <endpoint>/<bucket>/<key>.
      const url = new URL(endpoint);
      const base = `${url.pathname.replace(/\/+$/, "")}/${bucket}`;
      patterns.push({
        protocol: "https",
        hostname: url.hostname,
        pathname: prefix ? `${base}/${prefix}/**` : `${base}/**`,
      });
    } else {
      patterns.push({
        protocol: "https",
        hostname: `${bucket}.s3.${region}.amazonaws.com`,
        pathname: prefix ? `/${prefix}/**` : "/**",
      });
    }
  }
  const publicBase = process.env.S3_PUBLIC_BASE_URL?.trim();
  if (publicBase) {
    const url = new URL(publicBase);
    patterns.push({
      protocol: "https",
      hostname: url.hostname,
      pathname: `${url.pathname.replace(/\/+$/, "")}/**`,
    });
  }
  return patterns;
}

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    qualities: [75],
    remotePatterns: galleryImagePatterns(),
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
