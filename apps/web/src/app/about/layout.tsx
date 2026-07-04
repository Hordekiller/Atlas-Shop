import { Metadata } from "next";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "درباره ما",
  description: SITE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: `درباره ما | ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
