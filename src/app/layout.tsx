import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SouthEast Properties | Premium Real Estate in South Africa",
  description:
    "Premium property solutions across South Africa — co-living spaces, landlord services, and expert real estate guidance.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Read theme from cookie so SSR and client agree on the `dark` class.
  // Falls back to prefers-color-scheme via the inline script (first visit, no cookie yet).
  const headerList = await headers();
  const cookieTheme = headerList.get("cookie") || "";
  const isDark = cookieTheme.includes("theme=dark");

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased${isDark ? " dark" : ""}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const t = localStorage.getItem('theme'); if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) { document.documentElement.classList.add('dark'); } } catch {} })();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
