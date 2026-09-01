import { notFound } from "next/navigation";
import { Mail, MessageSquare } from "lucide-react";
import { getSubmissions } from "@/actions/admin/submissions";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EmptyState from "@/components/admin/EmptyState";
import DeleteSubmissionButton from "@/components/admin/DeleteSubmissionButton";

export const dynamic = "force-dynamic";

type SubmissionType = "contact" | "enquiry" | "landlord";

const validTypes: SubmissionType[] = ["contact", "enquiry", "landlord"];

const labels: Record<SubmissionType, string> = {
  contact: "Contact Submissions",
  enquiry: "Enquiry Submissions",
  landlord: "Landlord Submissions",
};

const descriptions: Record<SubmissionType, string> = {
  contact:
    "Inbound messages from the public contact form on the website footer and contact page.",
  enquiry: "Property enquiries submitted from individual property pages.",
  landlord: "New landlord leads from the Landlords marketing page.",
};

export default async function SubmissionsPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  if (!validTypes.includes(type as SubmissionType)) {
    notFound();
  }
  const subType = type as SubmissionType;
  const { items, total } = await getSubmissions(subType, 1, 50);

  const totalLabel =
    total === 0
      ? "No submissions yet"
      : `${total} total submission${total !== 1 ? "s" : ""}`;

  return (
    <div>
      <AdminPageHeader
        title={labels[subType]}
        subtitle={totalLabel}
        backHref="/admin"
        backLabel="Back to dashboard"
      />

      {items.length === 0 ? (
        <EmptyState
          icon={subType === "contact" ? Mail : MessageSquare}
          title={`No ${labels[subType].toLowerCase()} yet`}
          description={descriptions[subType]}
        />
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const record = item as Record<string, string | number | Date>;
            return (
              <article
                key={String(record.id)}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 md:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[var(--text-primary)]">
                      {String(record.name)}{" "}
                      <span className="font-normal text-[var(--text-secondary)]">
                        &lt;{String(record.email)}&gt;
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">
                      {new Date(record.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <DeleteSubmissionButton
                    type={subType}
                    id={Number(record.id)}
                  />
                </div>
                <dl className="mt-3 grid gap-1 text-sm">
                  {Object.entries(record)
                    .filter(([k]) => !["id", "createdAt", "ip"].includes(k))
                    .map(([key, value]) => (
                      <div key={key} className="flex gap-2">
                        <dt className="shrink-0 font-medium text-[var(--text-secondary)] capitalize">
                          {key}:
                        </dt>
                        <dd className="break-words text-[var(--text-primary)]">
                          {String(value)}
                        </dd>
                      </div>
                    ))}
                </dl>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
