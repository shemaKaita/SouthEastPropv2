"use server";

import type { ActionResult, ContactFormData } from "@/types/forms";
import { logInfo, logError } from "@/lib/logger";

/**
 * Server action for contact form submissions.
 *
 * Currently logs the submission. Integration point for:
 * - Email service (Resend, SendGrid, etc.)
 * - CRM API
 * - Database persistence
 */
export async function submitContactForm(
  data: ContactFormData,
): Promise<ActionResult> {
  try {
    // Basic server-side validation
    if (!data.name?.trim() || !data.email?.trim() || !data.message?.trim()) {
      return {
        success: false,
        message: "All required fields must be filled.",
        errors: {
          name: !data.name?.trim() ? "Name is required" : undefined,
          email: !data.email?.trim() ? "Email is required" : undefined,
          message: !data.message?.trim() ? "Message is required" : undefined,
        } as Record<string, string>,
      };
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return {
        success: false,
        message: "Please provide a valid email address.",
        errors: { email: "Invalid email format" },
      };
    }

    // Integration point: send email, save to DB, notify CRM
    logInfo("Contact form submitted", {
      name: data.name,
      email: data.email,
      subject: data.subject,
    });

    return {
      success: true,
      message:
        "Your message has been sent. We'll get back to you within 24 hours.",
    };
  } catch (error) {
    logError(error instanceof Error ? error : String(error), {
      action: "submitContactForm",
    });
    return {
      success: false,
      message:
        "An error occurred while sending your message. Please try again.",
    };
  }
}
