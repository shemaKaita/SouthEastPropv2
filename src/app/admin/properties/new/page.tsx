import type { Metadata } from "next";
import PropertyForm from "@/components/admin/PropertyForm";
import { createPropertyAction } from "@/actions/admin/properties";

export const metadata: Metadata = {
  title: "New Property — Admin",
  robots: { index: false, follow: false },
};

export default function NewPropertyPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[var(--text-primary)]">
        New Property
      </h1>
      <PropertyForm
        action={createPropertyAction}
        submitLabel="Create Property"
      />
    </div>
  );
}
