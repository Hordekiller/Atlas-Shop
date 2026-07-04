import { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "تماس با ما",
  description: "راه‌های ارتباطی با ما",
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: `تماس با ما | ${SITE_NAME}`,
    description: "راه‌های ارتباطی با ما",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
