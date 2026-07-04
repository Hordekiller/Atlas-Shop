import { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "سبد خرید",
  description: `سبد خرید شما در ${SITE_NAME}`,
  alternates: { canonical: `${SITE_URL}/cart` },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
