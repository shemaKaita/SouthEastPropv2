"use server";

import type { ActionResult, LandlordFormData } from "@/types/forms";
import { logInfo, logError } from "@/lib/logger";
import { isValidEmail } from "@/lib/validation";
import { rateLimit, FORM_RATE_LIMIT } from "@/lib/rateLimit";
import { sanitizeObjectForLog } from "@/lib/sanitize";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

/**
 * Server action for landlord enquiry submissions.
 */
export async function submitLandlordForm(
  data: LandlordFormData,
): Promise<ActionResult<LandlordFormData>> {
  try {
    const headerList = await headers();
    const ip =
      headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { limited } = rateLimit(
      `landlord:${ip}`,
      FORM_RATE_LIMIT.maxRequests,
      FORM_RATE_LIMIT.windowMs,
    );
    if (limited) {
      return {
        success: false,
        message: "Too many submissions. Please try again later.",
      };
    }

    if (!data.name?.trim() || !data.email?.trim()) {
      return {
        success: false,
        message: "Name and email are required.",
        errors: {
          name: !data.name?.trim() ? "Name is required" : undefined,
          email: !data.email?.trim() ? "Email is required" : undefined,
        } as Record<string, string>,
      };
    }

    if (!isValidEmail(data.email)) {
      return {
        success: false,
        message: "Please provide a valid email address.",
        errors: { email: "Invalid email format" },
      };
    }

    logInfo(
      "Landlord enquiry submitted",
      sanitizeObjectForLog({
        name: data.name,
        email: data.email,
        phone: data.phone,
        location: data.location,
        propertyType: data.propertyType,
        units: data.units,
      }),
    );

    const submissionData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      location: data.location,
      propertyType: data.propertyType,
      units: data.units,
      ip,
    };

    await prisma.landlordSubmission.create({ data: submissionData });

    return {
      success: true,
      message:
        "Your enquiry has been received. We'll be in touch within 24 hours.",
      data,
    };
  } catch (error) {
    logError(error instanceof Error ? error : String(error), {
      action: "submitLandlordForm",
    });
    return {
      success: false,
      message:
        "An error occurred while submitting your enquiry. Please try again.",
    };
  }
}
