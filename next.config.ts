import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const isDev = process.env.NODE_ENV === "development";

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://images.unsplash.com https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com",
      "connect-src 'self' https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  // Scope Turbopack's file tracing to this repo. Without this, the bun.lock
  // in the parent projects directory triggers a warning and broader tracing.
  outputFileTracingRoot: __dirname,
  images: {
    formats: ["image/avif", "image/webp"],
    // Cap generated image widths. The default deviceSizes includes 3840, which
    // caused the hero to be requested at w=3840 (~82KB extra) plus a duplicate
    // w=2048 fetch. Largest layout box on this site is ~2560px at 2x DPR.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2560],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Serve uploaded images from the Railway Volume mount point.
  // In production, UPLOAD_DIR points to the volume path.
  // In dev, uploads go to public/uploads and are served statically.
  async rewrites() {
    const uploadDir = process.env.UPLOAD_DIR;
    if (!uploadDir || uploadDir === "public/uploads") return [];
    return [
      {
        source: "/uploads/:path*",
        destination: `${uploadDir.replace(/\/$/, "")}/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        // All routes get the security header baseline.
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // Public marketing pages are fully prerendered (Phase 1 CWV work).
        // Allow shared/CDN caching with stale-while-revalidate so repeat
        // visits and prefetches are served from cache while a fresh copy
        // regenerates in the background. Excludes hashed build assets
        // (immutable, handled by Next), the image optimizer, and uploads —
        // all of which manage their own lifetimes.
        source:
          "/((?!_next/static|_next/image|uploads|admin|api|favicon.ico).*)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
