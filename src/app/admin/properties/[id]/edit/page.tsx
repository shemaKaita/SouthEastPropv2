import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import PropertyForm from "@/components/admin/PropertyForm";
import { updatePropertyAction } from "@/actions/admin/properties";

export const metadata: Metadata = {
  title: "Edit Property — Admin",
  robots: { index: false, follow: false },
};

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await prisma.property.findUnique({ where: { id } });
  if (!property) notFound();

  const initialData = {
    slug: property.slug,
    title: property.title,
    location: property.location,
    price: property.price,
    priceLabel: property.priceLabel,
    beds: String(property.beds),
    baths: String(property.baths),
    area: String(property.area),
    lat: String(property.lat),
    lng: String(property.lng),
    availability: property.availability,
    badge: property.badge,
    featuredImage: property.featuredImage,
    galleryImages: property.galleryImages,
    description: property.description,
    amenities: property.amenities as Array<{ icon: string; label: string }>,
  };

  const boundAction = updatePropertyAction.bind(null, id);

  return (
    <div>
      <AdminPageHeader
        title={`Edit: ${property.title}`}
        subtitle={`Slug: ${property.slug}`}
        backHref="/admin/properties"
        backLabel="Back to properties"
      />
      <PropertyForm
        initialData={initialData}
        action={boundAction}
        submitLabel="Save Changes"
      />
    </div>
  );
}
