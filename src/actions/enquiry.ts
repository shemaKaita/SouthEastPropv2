"use server";

import type { ActionResult, EnquiryFormData } from "@/types/forms";
import { logInfo, logError } from "@/lib/logger";
import { isValidEmail } from "@/lib/validation";
import { rateLimit, FORM_RATE_LIMIT } from "@/lib/rateLimit";
import { sanitizeObjectForLog } from "@/lib/sanitize";
import { headers } from "next/headers";

/**
 * Server action for property enquiry submissions.
 *
 * Associates the enquiry with a specific property via propertySlug.
 */
export async function submitEnquiryForm(
  data: EnquiryFormData,
): Promise<ActionResult> {
  try {
    const headerList = await headers();
    const ip =
      headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { limited } = rateLimit(
      `enquiry:${ip}`,
      FORM_RATE_LIMIT.maxRequests,
      FORM_RATE_LIMIT.windowMs,
    );
    if (limited) {
      return {
        success: false,
        message: "Too many submissions. Please try again later.",
      };
    }

    if (
      !data.name?.trim() ||
      !data.email?.trim() ||
      !data.propertySlug?.trim()
    ) {
      return {
        success: false,
        message: "All required fields must be filled.",
        errors: {
          name: !data.name?.trim() ? "Name is required" : undefined,
          email: !data.email?.trim() ? "Email is required" : undefined,
          propertySlug: !data.propertySlug?.trim()
            ? "Property is required"
            : undefined,
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
      "Property enquiry submitted",
      sanitizeObjectForLog({
        name: data.name,
        email: data.email,
        propertySlug: data.propertySlug,
        moveInDate: data.moveInDate,
      }),
    );

    return {
      success: true,
      message:
        "Your enquiry has been received. We'll be in touch within 24 hours.",
    };
  } catch (error) {
    logError(error instanceof Error ? error : String(error), {
      action: "submitEnquiryForm",
    });
    return {
      success: false,
      message:
        "An error occurred while submitting your enquiry. Please try again.",
    };
  }
}
