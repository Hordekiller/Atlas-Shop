import { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "ورود",
  description: `ورود به حساب کاربری ${SITE_NAME}`,
  alternates: { canonical: `${SITE_URL}/auth/login` },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
