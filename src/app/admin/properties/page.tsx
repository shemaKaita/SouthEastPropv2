import Link from "next/link";
import { Plus, Pencil, Eye } from "lucide-react";
import { prisma } from "@/lib/prisma";
import DeletePropertyButton from "@/components/admin/DeletePropertyButton";

export const dynamic = "force-dynamic";

export default async function AdminPropertiesPage() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Properties
        </h1>
        <Link
          href="/admin/properties/new"
          className="text-navy-900 inline-flex items-center gap-2 rounded-lg bg-[var(--accent-yellow)] px-4 py-2 text-sm font-bold transition-colors hover:bg-[var(--accent-yellow-hover)]"
        >
          <Plus className="h-4 w-4" />
          New Property
        </Link>
      </div>

      {properties.length === 0 ? (
        <p className="text-sm text-[var(--text-secondary)]">
          No properties yet. Click &quot;New Property&quot; to create one.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg-surface)]">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-[var(--text-primary)]">
                  Title
                </th>
                <th className="px-4 py-3 text-left font-semibold text-[var(--text-primary)]">
                  Location
                </th>
                <th className="px-4 py-3 text-left font-semibold text-[var(--text-primary)]">
                  Price
                </th>
                <th className="px-4 py-3 text-left font-semibold text-[var(--text-primary)]">
                  Badge
                </th>
                <th className="px-4 py-3 text-right font-semibold text-[var(--text-primary)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-[var(--border-subtle)]"
                >
                  <td className="px-4 py-3 text-[var(--text-primary)]">
                    {p.title}
                  </td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">
                    {p.location}
                  </td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">
                    {p.price}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-[var(--accent-yellow)]/20 px-2 py-0.5 text-xs font-medium text-[var(--accent-yellow)]">
                      {p.badge || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/properties/${p.slug}`}
                        className="rounded p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]"
                        aria-label="View property"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/properties/${p.id}/edit`}
                        className="rounded p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]"
                        aria-label="Edit property"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeletePropertyButton id={p.id} title={p.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
