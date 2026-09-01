/**
 * Image upload configuration.
 *
 * Uploaded files are stored on a Railway Volume mounted at /app/uploads.
 * The Next.js server serves them via a rewrite rule from /uploads/*.
 */

import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

/** Directory where uploaded images are stored (Railway Volume mount point) */
export function getUploadDir(): string {
  return process.env.UPLOAD_DIR ?? join(process.cwd(), "public", "uploads");
}

/** Maximum file size: 10 MB */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** Allowed MIME types for uploads */
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

/** Allowed file extensions (mapped from MIME types) */
const EXTENSION_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export type UploadResult = {
  success: boolean;
  url?: string;
  message: string;
};

/**
 * Save an uploaded file to the volume and return its public URL.
 * Validates MIME type and file size.
 */
export async function saveUpload(file: File): Promise<UploadResult> {
  if (
    !ALLOWED_MIME_TYPES.includes(
      file.type as (typeof ALLOWED_MIME_TYPES)[number],
    )
  ) {
    return {
      success: false,
      message: `Invalid file type. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      message: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  const ext = EXTENSION_MAP[file.type] ?? "jpg";
  const filename = `${randomUUID()}.${ext}`;

  const uploadDir = getUploadDir();
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const filepath = join(uploadDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filepath, buffer);

  return {
    success: true,
    url: `/uploads/${filename}`,
    message: "Upload successful.",
  };
}
