import type { Metadata } from "next";
import { getSiteContent } from "@/actions/admin/settings";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import SettingsForm from "@/components/admin/SettingsForm";

export const metadata: Metadata = {
  title: "Settings — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const content = await getSiteContent();

  return (
    <div>
      <AdminPageHeader
        title="Settings"
        subtitle="Edit the JSON content used across the public site. Each section is saved independently."
        backHref="/admin"
        backLabel="Back to dashboard"
      />
      <SettingsForm
        navItems={JSON.stringify(content.nav_items ?? [], null, 2)}
        socialLinks={JSON.stringify(content.social_links ?? [], null, 2)}
        contactDetails={JSON.stringify(content.contact_details ?? [], null, 2)}
      />
    </div>
  );
}
