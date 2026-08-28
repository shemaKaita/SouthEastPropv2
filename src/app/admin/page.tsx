import Link from "next/link";
import { Building2, Mail, Users, Settings, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type StatItem = {
  label: string;
  value: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

export default async function AdminDashboardPage() {
  const [propertyCount, contactCount, enquiryCount, landlordCount] =
    await Promise.all([
      prisma.property.count(),
      prisma.contactSubmission.count(),
      prisma.enquirySubmission.count(),
      prisma.landlordSubmission.count(),
    ]);

  const stats: StatItem[] = [
    {
      label: "Properties",
      value: String(propertyCount),
      href: "/admin/properties",
      icon: Building2,
    },
    {
      label: "Contact",
      value: String(contactCount),
      href: "/admin/submissions/contact",
      icon: Mail,
    },
    {
      label: "Landlords",
      value: String(landlordCount),
      href: "/admin/submissions/landlord",
      icon: Users,
    },
    {
      label: "Enquiries",
      value: String(enquiryCount),
      href: "/admin/submissions/enquiry",
      icon: Mail,
    },
    {
      label: "Settings",
      value: "Edit",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">
        Dashboard
      </h1>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        Welcome to the SouthEast Properties admin panel.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 transition-all hover:border-[var(--accent-yellow)] hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <stat.icon className="h-8 w-8 text-[var(--accent-yellow)]" />
              <ArrowRight className="h-4 w-4 text-[var(--text-secondary)] transition-transform group-hover:translate-x-1" />
            </div>
            <p className="mt-4 text-2xl font-bold text-[var(--text-primary)]">
              {stat.value}
            </p>
            <p className="text-xs tracking-wider text-[var(--text-secondary)] uppercase">
              {stat.label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
