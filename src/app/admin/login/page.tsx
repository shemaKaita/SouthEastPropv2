import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login — SouthEast Properties",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const session = await getSession();
  if (session.userId) {
    redirect("/admin");
  }

  const { from } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-base)] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] sm:text-3xl">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            SouthEast Properties Dashboard
          </p>
        </div>
        <LoginForm redirectTo={from ?? "/admin"} />
        <p className="mt-6 text-center text-xs text-[var(--text-secondary)]">
          Need access? Contact the site administrator.
        </p>
      </div>
    </div>
  );
}
