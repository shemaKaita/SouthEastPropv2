"use server";

/**
 * Admin site content management server actions.
 *
 * Read and update editable site content (nav, social, contact details)
 * stored in the SiteContent table as JSON.
 */

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { clearContentCache } from "@/lib/site-content";
import { logError, logInfo } from "@/lib/logger";
import type { ActionResult } from "@/types/forms";

const contentSchema = z.object({
  key: z.string().min(1),
  value: z.string().refine((val) => {
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  }, "Must be valid JSON"),
});

export async function getSiteContent() {
  await requireAuth();
  const items = await prisma.siteContent.findMany();
  const map: Record<string, unknown> = {};
  for (const item of items) {
    map[item.key] = item.value;
  }
  return map;
}

export async function updateSiteContentAction(
  formData: FormData,
): Promise<ActionResult> {
  await requireAuth();
  const key = formData.get("key")?.toString();
  const value = formData.get("value")?.toString();
  const parsed = contentSchema.safeParse({ key, value });
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid content data",
      errors: { value: parsed.error.issues[0]?.message ?? "Invalid" },
    };
  }
  try {
    await prisma.siteContent.upsert({
      where: { key: parsed.data.key },
      update: { value: JSON.parse(parsed.data.value) },
      create: {
        key: parsed.data.key,
        value: JSON.parse(parsed.data.value),
      },
    });
    revalidatePath("/");
    clearContentCache();
    logInfo("Site content updated", { key: parsed.data.key });
    return { success: true, message: "Content updated successfully." };
  } catch (error) {
    logError(error as Error, { context: "updateSiteContent" });
    return { success: false, message: "Failed to update content." };
  }
}
