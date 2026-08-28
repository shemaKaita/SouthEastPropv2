import { notFound } from "next/navigation";
import { getSubmissions } from "@/actions/admin/submissions";
import DeleteSubmissionButton from "@/components/admin/DeleteSubmissionButton";

export const dynamic = "force-dynamic";

type SubmissionType = "contact" | "enquiry" | "landlord";

const validTypes: SubmissionType[] = ["contact", "enquiry", "landlord"];

const labels: Record<SubmissionType, string> = {
  contact: "Contact Submissions",
  enquiry: "Enquiry Submissions",
  landlord: "Landlord Submissions",
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

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-[var(--text-primary)]">
        {labels[subType]}
      </h1>
      <p className="mb-6 text-sm text-[var(--text-secondary)]">
        {total} total submission{total !== 1 ? "s" : ""}
      </p>

      {items.length === 0 ? (
        <p className="text-sm text-[var(--text-secondary)]">
          No submissions yet.
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const record = item as Record<string, string | number | Date>;
            return (
              <div
                key={String(record.id)}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
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
                        <dt className="font-medium text-[var(--text-secondary)]">
                          {key}:
                        </dt>
                        <dd className="text-[var(--text-primary)]">
                          {String(value)}
                        </dd>
                      </div>
                    ))}
                </dl>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
