import { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "مقایسه محصولات",
  description: `مقایسه محصولات در ${SITE_NAME}`,
  alternates: { canonical: `${SITE_URL}/compare` },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
