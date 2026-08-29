import { headers } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * SiteChrome — renders public marketing Navbar + Footer on every route
 * EXCEPT /admin/*. The admin has its own dedicated layout with sidebar.
 *
 * Implemented as a SERVER component that reads the `x-pathname` header
 * forwarded by middleware. This keeps Footer (a server async component)
 * on the server side and avoids bundling Prisma into the client.
 *
 * On non-admin routes (where middleware does not run), x-pathname is
 * undefined, so we fall back to rendering the public chrome — the
 * default public-site behavior.
 */
export default async function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <a
        href="#main-content"
        className="focus:text-navy-900 sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-lg focus:bg-[var(--accent-yellow)] focus:px-4 focus:py-2 focus:text-sm focus:font-bold"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
