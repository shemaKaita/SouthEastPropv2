import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

// Mock auth to avoid importing next/headers
vi.mock("@/lib/auth", () => ({
  getSession: vi.fn(),
}));

import {
  saveUpload,
  getUploadDir,
  MAX_FILE_SIZE,
  ALLOWED_MIME_TYPES,
} from "@/lib/upload";

let tempDir: string;

beforeEach(() => {
  tempDir = mkdtempSync(join(tmpdir(), "upload-test-"));
  process.env.UPLOAD_DIR = tempDir;
});

afterEach(() => {
  rmSync(tempDir, { recursive: true, force: true });
});

function createFile(content: string, type: string, size?: number): File {
  const buffer = size ? Buffer.alloc(size, "x") : Buffer.from(content);
  return new File([buffer], "test.jpg", { type });
}

describe("saveUpload", () => {
  it("saves a valid JPEG file", async () => {
    const result = await saveUpload(createFile("fake-jpeg", "image/jpeg"));
    expect(result.success).toBe(true);
    expect(result.url).toMatch(/^\/uploads\/.+\.jpg$/);
    const filename = result.url!.replace("/uploads/", "");
    expect(existsSync(join(getUploadDir(), filename))).toBe(true);
  });

  it("saves a valid PNG file", async () => {
    const result = await saveUpload(createFile("fake-png", "image/png"));
    expect(result.success).toBe(true);
    expect(result.url).toMatch(/^\/uploads\/.+\.png$/);
  });

  it("saves a valid WebP file", async () => {
    const result = await saveUpload(createFile("fake-webp", "image/webp"));
    expect(result.success).toBe(true);
    expect(result.url).toMatch(/^\/uploads\/.+\.webp$/);
  });

  it("saves a valid AVIF file", async () => {
    const result = await saveUpload(createFile("fake-avif", "image/avif"));
    expect(result.success).toBe(true);
    expect(result.url).toMatch(/^\/uploads\/.+\.avif$/);
  });

  it("rejects invalid MIME type", async () => {
    const result = await saveUpload(
      createFile("exe", "application/octet-stream"),
    );
    expect(result.success).toBe(false);
    expect(result.message).toContain("Invalid file type");
  });

  it("rejects text/plain", async () => {
    const result = await saveUpload(createFile("hello", "text/plain"));
    expect(result.success).toBe(false);
  });

  it("rejects file exceeding max size", async () => {
    const result = await saveUpload(
      createFile("x", "image/jpeg", MAX_FILE_SIZE + 1),
    );
    expect(result.success).toBe(false);
    expect(result.message).toContain("File too large");
  });

  it("generates unique filenames", async () => {
    const r1 = await saveUpload(createFile("a", "image/jpeg"));
    const r2 = await saveUpload(createFile("b", "image/jpeg"));
    expect(r1.url).not.toBe(r2.url);
  });

  it("creates upload directory if it doesn't exist", async () => {
    const nestedDir = join(tempDir, "nested", "deeper");
    process.env.UPLOAD_DIR = nestedDir;
    const result = await saveUpload(createFile("test", "image/jpeg"));
    expect(result.success).toBe(true);
    expect(existsSync(nestedDir)).toBe(true);
  });

  it("ALLOWED_MIME_TYPES includes jpeg, png, webp, avif", () => {
    expect(ALLOWED_MIME_TYPES).toContain("image/jpeg");
    expect(ALLOWED_MIME_TYPES).toContain("image/png");
    expect(ALLOWED_MIME_TYPES).toContain("image/webp");
    expect(ALLOWED_MIME_TYPES).toContain("image/avif");
  });

  it("MAX_FILE_SIZE is 10MB", () => {
    expect(MAX_FILE_SIZE).toBe(10 * 1024 * 1024);
  });
});
