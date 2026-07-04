import { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "علاقه‌مندی‌ها",
  description: `محصولات مورد علاقه شما در ${SITE_NAME}`,
  alternates: { canonical: `${SITE_URL}/wishlist` },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
