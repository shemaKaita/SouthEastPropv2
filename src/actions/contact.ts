"use server";

import type { ActionResult, ContactFormData } from "@/types/forms";
import { logInfo, logError } from "@/lib/logger";
import { isValidEmail } from "@/lib/validation";
import { rateLimit, FORM_RATE_LIMIT } from "@/lib/rateLimit";
import { sanitizeObjectForLog } from "@/lib/sanitize";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

/**
 * Server action for contact form submissions.
 *
 * Persists to DB and logs. Integration point for:
 * - Email service (Resend, SendGrid, etc.)
 * - CRM API
 */
export async function submitContactForm(
  data: ContactFormData,
): Promise<ActionResult> {
  try {
    const headerList = await headers();
    const ip =
      headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { limited } = rateLimit(
      `contact:${ip}`,
      FORM_RATE_LIMIT.maxRequests,
      FORM_RATE_LIMIT.windowMs,
    );
    if (limited) {
      return {
        success: false,
        message: "Too many submissions. Please try again later.",
      };
    }

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
    if (!isValidEmail(data.email)) {
      return {
        success: false,
        message: "Please provide a valid email address.",
        errors: { email: "Invalid email format" },
      };
    }

    // Integration point: send email, save to DB, notify CRM
    logInfo(
      "Contact form submitted",
      sanitizeObjectForLog({
        name: data.name,
        email: data.email,
        subject: data.subject,
      }),
    );

    await prisma.contactSubmission.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        ip,
      },
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
