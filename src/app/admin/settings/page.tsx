import type { Metadata } from "next";
import { getSiteContent } from "@/actions/admin/settings";
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
      <h1 className="mb-6 text-2xl font-bold text-[var(--text-primary)]">
        Settings
      </h1>
      <SettingsForm
        navItems={JSON.stringify(content.nav_items ?? [], null, 2)}
        socialLinks={JSON.stringify(content.social_links ?? [], null, 2)}
        contactDetails={JSON.stringify(content.contact_details ?? [], null, 2)}
      />
    </div>
  );
}
