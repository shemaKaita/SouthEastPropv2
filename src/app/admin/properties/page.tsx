import Link from "next/link";
import { Plus, Pencil, Eye } from "lucide-react";
import { prisma } from "@/lib/prisma";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EmptyState from "@/components/admin/EmptyState";
import DeletePropertyButton from "@/components/admin/DeletePropertyButton";

export const dynamic = "force-dynamic";

type Property = Awaited<ReturnType<typeof prisma.property.findMany>>[number];

export default async function AdminPropertiesPage() {
  const properties: Property[] = await prisma.property.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <AdminPageHeader
        title="Properties"
        subtitle={
          properties.length === 1
            ? "1 property total"
            : `${properties.length} properties total`
        }
        action={
          <Link
            href="/admin/properties/new"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-yellow)] px-4 py-2 text-sm font-bold text-[var(--brand-navy)] transition-all hover:bg-[var(--accent-yellow-hover)] hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Property</span>
            <span className="sm:hidden">New</span>
          </Link>
        }
      />

      {properties.length === 0 ? (
        <EmptyState
          title="No properties yet"
          description="Add your first property to start populating the public listings page."
          action={
            <Link
              href="/admin/properties/new"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-yellow)] px-5 py-2.5 text-sm font-bold text-[var(--brand-navy)] transition-all hover:bg-[var(--accent-yellow-hover)]"
            >
              <Plus className="h-4 w-4" />
              Create your first property
            </Link>
          }
        />
      ) : (
        <>
          {/* Mobile / tablet: stacked cards */}
          <div className="grid gap-3 lg:hidden">
            {properties.map((p) => (
              <article
                key={p.id}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-[var(--text-primary)]">
                      {p.title}
                    </h3>
                    <p className="mt-0.5 truncate text-sm text-[var(--text-secondary)]">
                      {p.location}
                    </p>
                  </div>
                  {p.badge && (
                    <span className="shrink-0 rounded-full bg-[var(--accent-yellow)] px-2 py-0.5 text-xs font-semibold text-[var(--brand-navy)] dark:text-slate-900">
                      {p.badge}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-base font-semibold text-[var(--text-primary)] tabular-nums">
                    {p.price}
                  </p>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/properties/${p.slug}`}
                      title="View"
                      aria-label={`View ${p.title}`}
                      className="rounded p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-base)] hover:text-[var(--text-primary)]"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/admin/properties/${p.id}/edit`}
                      title="Edit"
                      aria-label={`Edit ${p.title}`}
                      className="rounded p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-base)] hover:text-[var(--text-primary)]"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <DeletePropertyButton id={p.id} title={p.title} />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Desktop: standard table */}
          <div className="hidden overflow-x-auto rounded-xl border border-[var(--border-subtle)] lg:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] text-left text-xs font-semibold tracking-wider text-[var(--text-secondary)] uppercase">
                  <th scope="col" className="px-4 py-3">
                    Title
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Location
                  </th>
                  <th scope="col" className="px-4 py-3 text-right">
                    Price
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Badge
                  </th>
                  <th scope="col" className="px-4 py-3 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-[var(--border-subtle)] transition-colors last:border-b-0 hover:bg-[var(--bg-surface)] dark:divide-white/5 dark:border-white/5"
                  >
                    <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                      {p.title}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      {p.location}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-[var(--text-primary)] tabular-nums">
                      {p.price}
                    </td>
                    <td className="px-4 py-3">
                      {p.badge ? (
                        <span className="rounded-full bg-[var(--accent-yellow)] px-2 py-0.5 text-xs font-semibold text-[var(--brand-navy)] dark:text-slate-900">
                          {p.badge}
                        </span>
                      ) : (
                        <span className="text-xs text-[var(--text-secondary)]">
                          —
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/properties/${p.slug}`}
                          title="View property"
                          aria-label={`View ${p.title}`}
                          className="rounded p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-base)] hover:text-[var(--text-primary)]"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/properties/${p.id}/edit`}
                          title="Edit property"
                          aria-label={`Edit ${p.title}`}
                          className="rounded p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-base)] hover:text-[var(--text-primary)]"
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
        </>
      )}
    </div>
  );
}
