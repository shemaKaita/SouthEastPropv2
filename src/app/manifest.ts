import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SouthEast Properties",
    short_name: "SouthEast",
    description:
      "Premium property solutions across South Africa — co-living spaces, landlord services, and expert real estate guidance.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#12285a",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}
