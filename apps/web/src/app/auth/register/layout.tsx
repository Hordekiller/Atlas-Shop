import { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "ثبت‌نام",
  description: `ثبت‌نام در ${SITE_NAME}`,
  alternates: { canonical: `${SITE_URL}/auth/register` },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
