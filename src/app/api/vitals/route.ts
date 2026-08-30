import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

/**
 * Web-vitals beacon sink.
 *
 * Receives CLS/INP/LCP/TTFB measurements from the client and logs them
 * as structured JSON — one line per beacon, greppable/ingestable by any
 * log pipeline. This is the integration point for a future observability
 * sink (Sentry, BigQuery, etc.): swap logger.info for the sink call.
 *
 * Deliberately fire-and-forget: no DB writes, no auth (the payload is
 * non-sensitive numeric telemetry), strict size cap, and rate-limit-free
 * by design (beacons are capped at one per metric per page view).
 */

export async function POST(request: Request): Promise<Response> {
  try {
    const text = await request.text();

    // Hard cap: vitals payloads are ~120 bytes; anything larger is abuse.
    if (text.length > 512) {
      return NextResponse.json({ ok: false }, { status: 413 });
    }

    const data = JSON.parse(text) as {
      name?: string;
      value?: number;
      rating?: string;
      path?: string;
    };

    // Validate shape; reject unknown metric names.
    const VALID = new Set(["CLS", "INP", "LCP", "TTFB"]);
    if (
      typeof data.name !== "string" ||
      !VALID.has(data.name) ||
      typeof data.value !== "number" ||
      typeof data.rating !== "string" ||
      typeof data.path !== "string" ||
      data.path.length > 200
    ) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    logger.info("web-vitals", {
      metric: data.name,
      value: Math.round(data.value),
      rating: data.rating,
      path: data.path,
    });

    return NextResponse.json({ ok: true });
  } catch {
    // Malformed payload: drop silently — telemetry must never throw.
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}