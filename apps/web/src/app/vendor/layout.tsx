import { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "فروشندگی",
  description: `پنل فروشندگان ${SITE_NAME}`,
  alternates: { canonical: `${SITE_URL}/vendor` },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
