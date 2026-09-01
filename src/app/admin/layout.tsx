import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin — SouthEast Properties",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Login page doesn't need auth — it handles its own redirect
  // But we still render it without the sidebar
  const isLoginRoute = !session.userId;

  if (isLoginRoute) {
    return <>{children}</>;
  }

  if (!session.role) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg-base)]">
      <AdminSidebar email={session.email ?? ""} />
      <main
        id="main-content"
        className="min-w-0 flex-1 overflow-x-hidden px-6 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10"
      >
        {children}
      </main>
    </div>
  );
}
