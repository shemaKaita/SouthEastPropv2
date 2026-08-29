import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import SiteChrome from "@/components/SiteChrome";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";
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

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const themeCookie = (await headers()).get("cookie") ?? "";
  const isDark = themeCookie.includes("theme=dark");
  const htmlClassName = [
    geistSans.variable,
    geistMono.variable,
    "h-full",
    "antialiased",
    isDark ? "dark" : "",
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
          <SiteChrome>{children}</SiteChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}
