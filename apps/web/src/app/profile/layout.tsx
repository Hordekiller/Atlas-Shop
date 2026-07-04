import { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "پروفایل کاربری",
  description: `مدیریت حساب کاربری در ${SITE_NAME}`,
  alternates: { canonical: `${SITE_URL}/profile` },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
