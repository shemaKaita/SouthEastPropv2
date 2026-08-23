"use server";

import type { ActionResult, LandlordFormData } from "@/types/forms";
import { logInfo, logError } from "@/lib/logger";

/**
 * Server action for landlord enquiry submissions.
 */
export async function submitLandlordForm(
  data: LandlordFormData,
): Promise<ActionResult<LandlordFormData>> {
  try {
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return {
        success: false,
        message: "Please provide a valid email address.",
        errors: { email: "Invalid email format" },
      };
    }

    logInfo("Landlord enquiry submitted", {
      name: data.name,
      email: data.email,
      phone: data.phone,
      location: data.location,
      propertyType: data.propertyType,
      units: data.units,
    });

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
