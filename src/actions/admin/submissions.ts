"use server";

/**
 * Admin submission management server actions.
 *
 * List and delete form submissions (contact, enquiry, landlord).
 * All actions require authentication.
 */

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { logError, logInfo } from "@/lib/logger";
import type { ActionResult } from "@/types/forms";

type SubmissionType = "contact" | "enquiry" | "landlord";

async function fetchSubmissions(
  type: SubmissionType,
  page: number,
  limit: number,
) {
  const skip = (page - 1) * limit;
  if (type === "contact") {
    const [items, total] = await Promise.all([
      prisma.contactSubmission.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.contactSubmission.count(),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
  if (type === "enquiry") {
    const [items, total] = await Promise.all([
      prisma.enquirySubmission.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.enquirySubmission.count(),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
  const [items, total] = await Promise.all([
    prisma.landlordSubmission.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.landlordSubmission.count(),
  ]);
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getSubmissions(
  type: SubmissionType,
  page = 1,
  limit = 20,
) {
  await requireAuth();
  return fetchSubmissions(type, page, limit);
}

async function removeSubmission(
  type: SubmissionType,
  id: number,
): Promise<void> {
  if (type === "contact") {
    await prisma.contactSubmission.delete({ where: { id } });
  } else if (type === "enquiry") {
    await prisma.enquirySubmission.delete({ where: { id } });
  } else {
    await prisma.landlordSubmission.delete({ where: { id } });
  }
}

export async function deleteSubmissionAction(
  type: SubmissionType,
  id: number,
): Promise<ActionResult> {
  await requireAuth();
  try {
    await removeSubmission(type, id);
    revalidatePath(`/admin/submissions/${type}`);
    logInfo("Submission deleted", { type, id });
    return { success: true, message: "Submission deleted." };
  } catch (error) {
    logError(error as Error, { context: "deleteSubmission" });
    return { success: false, message: "Failed to delete submission." };
  }
}
