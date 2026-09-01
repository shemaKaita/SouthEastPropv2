"use server";

/**
 * Admin property CRUD server actions.
 *
 * All actions require authentication via requireAuth().
 * Input validated with zod schemas.
 */

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { logError, logInfo } from "@/lib/logger";
import type { ActionResult } from "@/types/forms";

const amenitySchema = z.object({
  icon: z.string().min(1),
  label: z.string().min(1),
});

const propertySchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase, hyphens only"),
  title: z.string().min(1, "Title is required"),
  location: z.string().min(1, "Location is required"),
  price: z.string().min(1, "Price is required"),
  priceLabel: z.string().min(1, "Price label is required"),
  beds: z.coerce.number().int().min(0),
  baths: z.coerce.number().int().min(0),
  area: z.coerce.number().int().min(0),
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  availability: z.string().min(1),
  badge: z.string().default(""),
  featuredImage: z
    .string()
    .min(1, "Featured image is required")
    .refine(
      (val) => val.startsWith("/uploads/") || val.startsWith("http"),
      "Must be a valid URL or uploaded file path",
    ),
  galleryImages: z
    .array(
      z
        .string()
        .refine(
          (val) => val.startsWith("/uploads/") || val.startsWith("http"),
          "Must be a valid URL or uploaded file path",
        ),
    )
    .default([]),
  description: z.string().min(1, "Description is required"),
  amenities: z.array(amenitySchema).default([]),
});

type PropertyInput = z.infer<typeof propertySchema>;

export async function createPropertyAction(
  formData: FormData,
): Promise<ActionResult> {
  await requireAuth();
  const data = parsePropertyFormData(formData);
  const parsed = propertySchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: formatZodErrors(parsed.error),
    };
  }
  try {
    await prisma.property.create({ data: parsed.data });
    revalidatePath("/admin/properties");
    revalidatePath("/properties");
    revalidatePath("/");
    logInfo("Property created", { slug: parsed.data.slug });
    return { success: true, message: "Property created successfully." };
  } catch (error) {
    logError(error as Error, { context: "createProperty" });
    return { success: false, message: "Failed to create property." };
  }
}

export async function updatePropertyAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuth();
  const data = parsePropertyFormData(formData);
  const parsed = propertySchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: formatZodErrors(parsed.error),
    };
  }
  try {
    await prisma.property.update({ where: { id }, data: parsed.data });
    revalidatePath("/admin/properties");
    revalidatePath(`/properties/${parsed.data.slug}`);
    revalidatePath("/properties");
    revalidatePath("/");
    logInfo("Property updated", { id, slug: parsed.data.slug });
    return { success: true, message: "Property updated successfully." };
  } catch (error) {
    logError(error as Error, { context: "updateProperty" });
    return { success: false, message: "Failed to update property." };
  }
}

export async function deletePropertyAction(id: string): Promise<ActionResult> {
  await requireAuth();
  try {
    const property = await prisma.property.delete({ where: { id } });
    revalidatePath("/admin/properties");
    revalidatePath("/properties");
    revalidatePath("/");
    logInfo("Property deleted", { id, slug: property.slug });
    return { success: true, message: "Property deleted successfully." };
  } catch (error) {
    logError(error as Error, { context: "deleteProperty" });
    return { success: false, message: "Failed to delete property." };
  }
}

function parsePropertyFormData(formData: FormData): Record<string, unknown> {
  const galleryImages = formData
    .getAll("galleryImages")
    .filter((v) => v.toString().trim() !== "");
  const amenitiesRaw = formData.get("amenities");
  let amenities: Array<{ icon: string; label: string }> = [];
  if (amenitiesRaw) {
    try {
      amenities = JSON.parse(amenitiesRaw.toString());
    } catch {
      amenities = [];
    }
  }
  return {
    slug: formData.get("slug"),
    title: formData.get("title"),
    location: formData.get("location"),
    price: formData.get("price"),
    priceLabel: formData.get("priceLabel"),
    beds: formData.get("beds"),
    baths: formData.get("baths"),
    area: formData.get("area"),
    lat: formData.get("lat"),
    lng: formData.get("lng"),
    availability: formData.get("availability"),
    badge: formData.get("badge") ?? "",
    featuredImage: formData.get("featuredImage"),
    galleryImages,
    description: formData.get("description"),
    amenities,
  };
}

function formatZodErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
}

export type { PropertyInput };
