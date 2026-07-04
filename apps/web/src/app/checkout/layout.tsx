import { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "تسویه حساب",
  description: `تکمیل سفارش و پرداخت در ${SITE_NAME}`,
  alternates: { canonical: `${SITE_URL}/checkout` },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
