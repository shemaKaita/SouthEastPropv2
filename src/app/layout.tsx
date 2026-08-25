import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL("https://southeastprop.co.za"),
  title: {
    default: "SouthEast Properties | Premium Real Estate in South Africa",
    template: "%s | SouthEast Properties",
  },
  description:
    "Premium property solutions across South Africa — co-living spaces, landlord services, and expert real estate guidance.",
  openGraph: {
    type: "website",
    locale: "en_ZA",
    siteName: "SouthEast Properties",
    url: "https://southeastprop.co.za",
    title: "SouthEast Properties | Premium Real Estate in South Africa",
    description:
      "Premium property solutions across South Africa — co-living spaces, landlord services, and expert real estate guidance.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SouthEast Properties | Premium Real Estate in South Africa",
    description:
      "Premium property solutions across South Africa — co-living spaces, landlord services, and expert real estate guidance.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch{}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              name: "SouthEast Properties",
              description:
                "Premium property solutions across South Africa — co-living spaces, landlord services, and expert real estate guidance.",
              url: "https://southeastprop.co.za",
              email: "info@southeastproperties.co.za",
              telephone: "+27210000000",
              address: {
                "@type": "PostalAddress",
                streetAddress: "42 Lower Main Road",
                addressLocality: "Observatory, Cape Town",
                addressCountry: "ZA",
              },
              areaServed: "Cape Town, South Africa",
            }),
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-[var(--accent-yellow)] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-navy-900"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <Navbar />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
