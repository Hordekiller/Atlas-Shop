import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_SHORT_NAME, SITE_DESCRIPTION } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_SHORT_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ef4056",
    orientation: "portrait",
    lang: "fa",
    dir: "rtl",
    icons: [
      { src: "/pwa-icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/pwa-icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/pwa-icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
