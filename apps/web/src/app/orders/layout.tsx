import { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "سفارشات",
  description: `مشاهده سفارشات شما در ${SITE_NAME}`,
  alternates: { canonical: `${SITE_URL}/orders` },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
