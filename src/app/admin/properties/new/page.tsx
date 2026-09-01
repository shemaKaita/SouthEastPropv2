import type { Metadata } from "next";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import PropertyForm from "@/components/admin/PropertyForm";
import { createPropertyAction } from "@/actions/admin/properties";

export const metadata: Metadata = {
  title: "New Property — Admin",
  robots: { index: false, follow: false },
};

export default function NewPropertyPage() {
  return (
    <div>
      <AdminPageHeader
        title="New Property"
        subtitle="Add a new listing to the public catalog."
        backHref="/admin/properties"
        backLabel="Back to properties"
      />
      <PropertyForm
        action={createPropertyAction}
        submitLabel="Create Property"
      />
    </div>
  );
}
