import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteChrome from "@/components/SiteChrome";
import { ThemeProvider } from "@/components/ThemeProvider";
import Instrumentation from "@/components/Instrumentation";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";
import type { ReactElement } from "react";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Premium Real Estate in South Africa`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "en_ZA",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: `${SITE_NAME} | Premium Real Estate in South Africa`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Premium Real Estate in South Africa`,
    description: SITE_DESCRIPTION,
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">): ReactElement {
  // NOTE: No `headers()` access here. Reading the theme cookie at request time
  // forces the root layout (and therefore every page) into dynamic rendering.
  // Theme is applied FOUC-free by the inline script below (localStorage +
  // prefers-color-scheme), so a server-side cookie read is redundant.
  const htmlClassName = [
    geistSans.variable,
    geistMono.variable,
    "h-full",
    "antialiased",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <html lang="en" className={htmlClassName} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const t=localStorage.getItem('theme')||(document.cookie.match(/(?:^|;\\s*)theme=(dark|light)/)||[])[1];if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch{}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              name: SITE_NAME,
              description: SITE_DESCRIPTION,
              url: SITE_URL,
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
        <ThemeProvider>
          <Instrumentation />
          <SiteChrome>{children}</SiteChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}
