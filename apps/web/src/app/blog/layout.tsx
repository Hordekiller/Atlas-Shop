import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "وبلاگ",
  description: "آخرین مقالات، راهنماها و اخبار فروشگاه",
  openGraph: {
    title: `وبلاگ ${SITE_NAME}`,
    description: "مقالات و راهنماهای خرید",
    url: `${SITE_URL}/blog`,
  },
  alternates: { canonical: `${SITE_URL}/blog` },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
